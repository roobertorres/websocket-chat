const router = require('express').Router()
const db = require('../config/database.js')

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

    if (!id_chat || !texto_mensagem) return res.status(400).send({ mensagem: 'Informe o id do chat e a mensagem' })

    const [verificar_participante] = await db.query('SELECT * FROM participante_chat WHERE chat_participante = ? AND usuario_participante = ?', [id_chat, id_usuario])
    if (verificar_participante.length === 0) return res.status(400).send({ mensagem: 'Chat não encontrado' })

    try {
        const data_hora_mensagem = new Date()

        const [mensagem] = await db.execute('INSERT INTO mensagem (chat_mensagem, usuario_remetente, texto_mensagem, data_hora_mensagem) VALUES (?, ?, ?, ?)', [id_chat, id_usuario, texto_mensagem, data_hora_mensagem])

        const notificacoes = require('../functions/notificacoes/novaMensagem.js')
        notificacoes.notificarRemetente(mensagem.insertId, id_chat, id_usuario, texto_mensagem, data_hora_mensagem)
        notificacoes.notificarDestinatario(mensagem.insertId, id_chat, id_usuario, texto_mensagem, data_hora_mensagem)

        res.send({
            id_mensagem: mensagem.insertId,
            chat_mensagem: id_chat,
            texto_mensagem,
            data_hora_mensagem,
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao enviar a mensagem' })
    }
})

router.get('/mensagens/:id_chat', async (req, res) => {
    const { id_usuario } = req
    const { id_chat } = req.params

    if (!id_chat) return res.status(400).send({ mensagem: 'Informe o id do chat' })

    const [verificar_participante] = await db.query('SELECT * FROM participante_chat WHERE chat_participante = ? AND usuario_participante = ?', [id_chat, id_usuario])
    if (verificar_participante.length === 0) return res.status(400).send({ mensagem: 'Chat não encontrado' })

    try {
        const [mensagens] = await db.execute(`
            SELECT
                id_mensagem,
                texto_mensagem,
                nome_usuario AS nome_usuario_remetente,
                data_hora_mensagem,
                excluida
            FROM
                mensagem
            JOIN
                usuario ON id_usuario = usuario_remetente
            WHERE
                chat_mensagem = ?
            ORDER BY
                id_mensagem
        `, [id_chat])

        const limparNotificacoesChat = require('../functions/notificacoes/limparNotificacoesChat.js')
        limparNotificacoesChat(id_usuario, id_chat)

        res.send(mensagens)
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao buscar as mensagens' })
    }
})

module.exports = router