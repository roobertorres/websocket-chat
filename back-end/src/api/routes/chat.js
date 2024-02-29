const router = require('express').Router()
const db = require('../config/database.js')
const notificacoes = require("../functions/notificacoes/novaMensagem")
const limparNotificacoesChat = require('../functions/notificacoes/limparNotificacoesChat.js')
const notificarMensagensLidas = require('../functions/notificacoes/mensagemLida.js')

// get dos chats do usuário que retorna o id do chat, nome do outro usuário

router.get('/', async (req, res) => {
    const { id_usuario } = req

    try {
        const [chats] = await db.query(`
            SELECT
                id_chat,
                nome_usuario,
                id_usuario
            FROM
                chat
            JOIN
                participante_chat ON id_chat = chat_participante
            JOIN
                usuario ON usuario_participante = id_usuario
            WHERE
                id_chat IN (
                    SELECT
                        chat_participante
                    FROM
                        participante_chat
                    WHERE
                        usuario_participante = ?
                )
            AND
                id_usuario != ?
        `, [id_usuario, id_usuario])

        res.send(chats)
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao buscar os chats' })
    }
})

router.post('/mensagens/:id_chat', async (req, res) => {
    const { id_usuario } = req
    const { id_chat } = req.params
    const { texto_mensagem } = req.body

    if (!id_chat || !texto_mensagem) return res.status(422).send({ mensagem: 'Informe o id do chat e a mensagem' })

    const [verificar_participante] = await db.query('SELECT * FROM participante_chat WHERE chat_participante = ? AND usuario_participante = ?', [id_chat, id_usuario])
    if (verificar_participante.length === 0) return res.status(404).send({ mensagem: 'Chat não encontrado' })

    try {
        const data_hora_mensagem = new Date()

        await db.query('START TRANSACTION')
        const [mensagem] = await db.execute('INSERT INTO mensagem (chat_mensagem, usuario_remetente, texto_mensagem, data_hora_mensagem) VALUES (?, ?, ?, ?)', [id_chat, id_usuario, texto_mensagem, data_hora_mensagem])

        // Atualizar o número total de mensagens do chat
        await db.execute('UPDATE chat SET count_messages = count_messages + 1 WHERE id_chat = ? ', [id_chat])

        // Atualizar o id da última mensagem do chat
        await db.execute('UPDATE chat SET last_message_id = ? WHERE id_chat = ? ', [mensagem.insertId, id_chat])
        await db.query('COMMIT')

        res.send({
            id_mensagem: mensagem.insertId,
            chat_mensagem: id_chat,
            texto_mensagem,
            data_hora_mensagem,
        })

        const notificacoes = require('../functions/notificacoes/novaMensagem.js')
        notificacoes.notificarRemetente(mensagem.insertId, id_chat, id_usuario, texto_mensagem, data_hora_mensagem)
        notificacoes.notificarDestinatario(mensagem.insertId, id_chat, id_usuario, texto_mensagem, data_hora_mensagem)

    }
    catch (error) {
        console.error(error)
        await db.query('ROLLBACK')
        res.status(500).send({ mensagem: 'Houve um erro ao enviar a mensagem' })
    }
})

router.patch('/mensagens/lidas', async (req, res) => {
    const { id_usuario } = req
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) return res.status(422).send({ mensagem: 'Informe as mensagens' })

    let processed_messages = []

    try {
        await db.query('START TRANSACTION')

        for (const message of messages) {

            const [mensagem] = await db.query('SELECT id_mensagem, chat_mensagem, usuario_remetente FROM mensagem WHERE id_mensagem = ?', [message])
            if (mensagem.length === 0) continue

            const [participante_chat] = await db.query('SELECT id_participante_chat FROM participante_chat WHERE chat_participante = ? AND usuario_participante = ?', [mensagem[0].chat_mensagem, id_usuario])
            if (participante_chat.length === 0) continue

            const [mensagem_lida] = await db.query('SELECT * FROM mensagem_lida WHERE mensagem = ? AND usuario_participante_chat = ?', [message, participante_chat[0].id_participante_chat])
            if (mensagem_lida.length > 0) continue

            const now = new Date()

            const [inserir_mensagem_lida] = await db.execute('INSERT INTO mensagem_lida (mensagem, usuario_participante_chat, data_hora_leitura) VALUES (?, ?, ?)', [message, participante_chat[0].id_participante_chat, now])
            if (inserir_mensagem_lida.affectedRows === 1) {
                processed_messages.push({
                    id_mensagem: message,
                    usuario_remetente: mensagem[0].usuario_remetente,
                    data_hora_leitura: now,
                })
            }
        }

        notificarMensagensLidas(processed_messages)

        await db.query('COMMIT')
        res.send(processed_messages)
    }
    catch (error) {
        await db.query('ROLLBACK')
        console.error(error)
        res.status(500).send({ mensagem: 'Houve um erro ao marcar a mensagem como lida' })
    }
})

router.get('/mensagens/:id_chat', async (req, res) => {
    const { id_usuario } = req
    const { id_chat } = req.params

    if (!id_chat) return res.status(400).send({ mensagem: 'Informe o id do chat' })

    const [verificar_participante] = await db.query('SELECT * FROM participante_chat WHERE chat_participante = ? AND usuario_participante = ?', [id_chat, id_usuario])
    if (verificar_participante.length === 0) return res.status(404).send({ mensagem: 'Chat não encontrado' })

    try {
        const last = req.query?.last ? String(req.query.last) : null

        const [total_messages] = await db.execute(`
        SELECT
            count_messages
        FROM
            chat
        WHERE
            id_chat = ?
        `, [id_chat])

        const [messages] = await db.execute(`
            SELECT
                id_mensagem,
                usuario_remetente,
                texto_mensagem,
                data_hora_mensagem,
                excluida,
                mensagem_lida.mensagem AS lida,
                mensagem_lida.data_hora_leitura
            FROM
                mensagem
            LEFT JOIN
                mensagem_lida ON mensagem.id_mensagem = mensagem_lida.mensagem
            WHERE
                chat_mensagem = ?
            AND
                (
                    ? IS NULL
                    OR
                    id_mensagem < ?
                )
            ORDER BY
                id_mensagem DESC
            LIMIT
                100
        `, [id_chat, last, last])

        res.setHeader('x-total-count', total_messages[0].count_messages || 0)
        res.send(messages.map(message => {
            return {
                id_mensagem: message.id_mensagem,
                usuario_remetente: message.usuario_remetente,
                texto_mensagem: message.texto_mensagem,
                data_hora_mensagem: message.data_hora_mensagem,
                excluida: message.excluida,
                lida: message.lida ? 1 : 0,
                data_hora_leitura: message.data_hora_leitura,
            }
        }))

        const { clear_notifications } = req.query

        if (clear_notifications) {
            limparNotificacoesChat(id_usuario, id_chat)
        }
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao buscar as mensagens' })
    }
})

router.get('/participantes/:id_chat', async (req, res) => {
    const { id_usuario } = req
    const { id_chat } = req.params

    if (!id_chat) return res.status(400).send({ mensagem: 'Informe o id do chat' })

    const [verificar_participante] = await db.query('SELECT * FROM participante_chat WHERE chat_participante = ? AND usuario_participante = ?', [id_chat, id_usuario])
    if (verificar_participante.length === 0) return res.status(404).send({ mensagem: 'Chat não encontrado' })

    try {
        const [participantes] = await db.query(`
            SELECT
                id_usuario,
                nome_usuario,
                email
            FROM
                usuario
            JOIN
                participante_chat ON id_usuario = usuario_participante
            WHERE
                chat_participante = ?
        `, [id_chat])

        res.send(participantes)
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao buscar os participantes do chat' })
    }
})

module.exports = router