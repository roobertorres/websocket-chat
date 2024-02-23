const router = require('express').Router()
const db = require('../config/database.js')
const notificacoesSolicitacaoAmizade = require('../functions/notificacoes/solicitacaoAmizade.js')

router.get('/amigos', async (req, res) => {
    const { id_usuario } = req

    try {
        const [amigos] = await db.query(`
        SELECT
            usuario.id_usuario,
            usuario.nome_usuario,
            usuario.email,
            usuario.status,
            solicitacao_amizade.amigos_desde
        FROM
            usuario
        INNER JOIN
            solicitacao_amizade
        ON
            usuario.id_usuario = solicitacao_amizade.usuario_solicitante
        WHERE
            solicitacao_amizade.usuario_solicitado = ?
        AND
            solicitacao_amizade.ativo = 1
        UNION
        SELECT
            usuario.id_usuario,
            usuario.nome_usuario,
            usuario.email,
            usuario.status,
            solicitacao_amizade.amigos_desde
        FROM
            usuario
        INNER JOIN  
            solicitacao_amizade
        ON
            usuario.id_usuario = solicitacao_amizade.usuario_solicitado
        WHERE
            solicitacao_amizade.usuario_solicitante = ?
        AND
            solicitacao_amizade.ativo = 1
        `
            , [id_usuario, id_usuario])

        const [id_chat_privado_amigo] = await db.query(`
        SELECT
            chat.id_chat
        FROM
            chat
        WHERE
            chat.id_chat
        IN
            (
                SELECT
                    chat_participante
                FROM
                    participante_chat
                WHERE
                    usuario_participante = ?
            )
        AND 
            chat.id_chat
        IN  
            (
                SELECT  
                    chat_participante
                FROM    
                    participante_chat
                WHERE   
                    usuario_participante
                IN  
                    (
                        SELECT
                            usuario_solicitante
                        FROM
                            solicitacao_amizade
                        WHERE   
                            usuario_solicitado = ?
                        AND
                            ativo = 1
                    UNION
                        SELECT
                            usuario_solicitado
                        FROM
                            solicitacao_amizade
                        WHERE
                            usuario_solicitante = ?
                        AND
                            ativo = 1
                    )
            )
        `
            , [id_usuario, id_usuario, id_usuario])

        res.send(amigos.map(amigo => {
            return {
                id_usuario: amigo.id_usuario,
                nome_usuario: amigo.nome_usuario,
                email: amigo.email,
                amigos_desde: amigo.amigos_desde,
                status: amigo.status,
                id_chat_privado: id_chat_privado_amigo[0].id_chat
            }
        }))
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao buscar os amigos' })
    }
})

router.post('/solicitacao-amizade/recusar/:id_solicitacao_amizade', async (req, res) => {
    const { id_usuario } = req
    const { id_solicitacao_amizade } = req.params

    try {
        const [solicitacao_amizade] = await db.query('SELECT * FROM solicitacao_amizade WHERE id_solicitacao_amizade = ? AND usuario_solicitado = ? AND pendente = 1', [id_solicitacao_amizade, id_usuario])
        if (solicitacao_amizade.length === 0) return res.status(404).send({ mensagem: 'Solicitação de amizade não encontrada' })

        await db.query('START TRANSACTION')
        await db.execute('UPDATE solicitacao_amizade SET pendente = 0, ativo = 0 WHERE id_solicitacao_amizade = ?', [id_solicitacao_amizade])
        await db.execute('UPDATE usuario SET quantidade_solicitacoes_amizade = quantidade_solicitacoes_amizade -1 WHERE id_usuario = ?', [id_usuario])
        await db.query('COMMIT')
        res.send({ mensagem: 'Solicitação de amizade recusada' })

        try {
            notificacoesSolicitacaoAmizade.notificarSolicitacaoRecusada(id_solicitacao_amizade)
        }
        catch (error) {
            console.error('Erro ao notificar solicitação de amizade recusada: ', error)
        }
    }
    catch (err) {
        await db.query('ROLLBACK')
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao recusar a solicitação de amizade' })
    }
})

router.post('/solicitacao-amizade/aceitar/:id_solicitacao_amizade', async (req, res) => {
    const { id_usuario } = req
    const { id_solicitacao_amizade } = req.params

    try {
        const [solicitacao_amizade] = await db.query('SELECT * FROM solicitacao_amizade WHERE id_solicitacao_amizade = ? AND usuario_solicitado = ? AND pendente = 1', [id_solicitacao_amizade, id_usuario])
        if (solicitacao_amizade.length === 0) return res.status(404).send({ mensagem: 'Solicitação de amizade não encontrada' })

        await db.query('START TRANSACTION')

        let chat_id = null

        // Verificar se já existe um chat privado entre os usuários
        const [chat_existente] = await db.query('SELECT * FROM chat WHERE tipo = "PRIVADO" AND id_chat IN (SELECT chat_participante FROM participante_chat WHERE usuario_participante = ?) AND id_chat IN (SELECT chat_participante FROM participante_chat WHERE usuario_participante = ?)', [id_usuario, solicitacao_amizade[0].usuario_solicitante])

        if (chat_existente.length === 0) {
            // Criar um chat privado
            const [chat] = await db.execute('INSERT INTO chat (tipo) VALUES ("PRIVADO")')
            chat_id = chat.insertId

            // Adicionar os usuários participantes do chat
            await db.execute('INSERT INTO participante_chat (chat_participante, usuario_participante) VALUES (?, ?)', [chat.insertId, id_usuario])
            await db.execute('INSERT INTO participante_chat (chat_participante, usuario_participante) VALUES (?, ?)', [chat.insertId, solicitacao_amizade[0].usuario_solicitante])
        }
        else {
            chat_id = chat_existente[0].id_chat
        }

        await db.execute('UPDATE solicitacao_amizade SET pendente = 0, ativo = 1, amigos_desde = ?, private_chat = ? WHERE id_solicitacao_amizade = ?', [new Date(), chat_id, id_solicitacao_amizade])
        await db.execute('UPDATE usuario SET quantidade_solicitacoes_amizade = quantidade_solicitacoes_amizade -1 WHERE id_usuario = ?', [id_usuario])
        await db.query('COMMIT')

        res.send({ mensagem: 'Solicitação de amizade aceita' })

        try {
            notificacoesSolicitacaoAmizade.notificarSolicitacaoAceita(id_solicitacao_amizade)
        }
        catch (error) {
            console.error('Erro ao notificar solicitação de amizade aceita: ', error)
        }
    }
    catch (err) {
        await db.query('ROLLBACK')
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao aceitar a solicitação de amizade' })
    }
})

router.delete('/solicitacoes-amizade/cancelar/:id_solicitacao_amizade', async (req, res) => {
    const { id_usuario } = req
    const { id_solicitacao_amizade } = req.params

    try {
        const [solicitacao_amizade] = await db.query('SELECT * FROM solicitacao_amizade WHERE id_solicitacao_amizade = ? AND usuario_solicitante = ? AND pendente = 1', [id_solicitacao_amizade, id_usuario])
        if (solicitacao_amizade.length === 0) return res.status(404).send({ mensagem: 'Solicitação de amizade não encontrada' })

        const solicitacao = await notificacoesSolicitacaoAmizade.buscarSolicitacoes(id_solicitacao_amizade)

        await db.query('START TRANSACTION')
        await db.execute('DELETE FROM solicitacao_amizade WHERE id_solicitacao_amizade = ?', [id_solicitacao_amizade])
        await db.execute('UPDATE usuario SET quantidade_solicitacoes_amizade = quantidade_solicitacoes_amizade -1 WHERE id_usuario = ?', [solicitacao_amizade[0].usuario_solicitado])
        res.send({ mensagem: 'Solicitação de amizade cancelada' })

        try {
            await notificacoesSolicitacaoAmizade.notificarSolicitacaoCancelada(solicitacao)
        }
        catch (error) {
            console.error('Erro ao notificar solicitação de amizade cancelada: ', error)
        }

        await db.query('COMMIT')
    }
    catch (err) {
        await db.query('ROLLBACK')
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao cancelar a solicitação de amizade' })
    }
})

router.get('/solicitacoes-amizade/enviadas', async (req, res) => {
    const { id_usuario } = req

    try {
        const [solicitacoes_enviadas] = await db.query('SELECT solicitacao_amizade.id_solicitacao_amizade, usuario.id_usuario, usuario.nome_usuario, usuario.email FROM solicitacao_amizade INNER JOIN usuario ON solicitacao_amizade.usuario_solicitado = usuario.id_usuario WHERE usuario_solicitante = ? AND pendente = 1', [id_usuario])

        res.send(solicitacoes_enviadas.map(solicitacao => {
            return {
                id_solicitacao_amizade: solicitacao.id_solicitacao_amizade,
                nome_usuario_solicitado: solicitacao.nome_usuario,
                email_usuario_solicitado: solicitacao.email
            }
        }))
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao buscar as solicitações de amizade enviadas' })
    }
})

router.get('/solicitacoes-amizade', async (req, res) => {
    const { id_usuario } = req

    try {
        const [solicitacoes] = await db.query('SELECT solicitacao_amizade.id_solicitacao_amizade, usuario.id_usuario, usuario.nome_usuario, usuario.email FROM solicitacao_amizade INNER JOIN usuario ON solicitacao_amizade.usuario_solicitante = usuario.id_usuario WHERE usuario_solicitado = ? AND pendente = 1', [id_usuario])
        res.send(solicitacoes.map(solicitacao => {
            return {
                id_solicitacao_amizade: solicitacao.id_solicitacao_amizade,
                nome_usuario_solicitante: solicitacao.nome_usuario,
                email_usuario_solicitante: solicitacao.email
            }
        }))
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao buscar as solicitações de amizade' })
    }
})

router.get('/solicitacoes-amizade/quantidade', async (req, res) => {
    const { id_usuario } = req

    try {
        const [quantidade] = await db.query('SELECT quantidade_solicitacoes_amizade AS quantidade FROM usuario WHERE id_usuario = ?', [id_usuario])
        res.send({ quantidade: quantidade[0].quantidade })
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao buscar as solicitações de amizade' })
    }
})

router.post('/solicitar-amizade', async (req, res) => {
    const { id_usuario } = req
    const { email } = req.body

    if (!email) return res.status(422).send({ mensagem: 'Informe o e-mail do usuário' })

    if (email === req.email) return res.status(400).send({ mensagem: 'Você não pode adicionar a si mesmo.' })

    // Verificar se o usuário existe
    const [usuario] = await db.query('SELECT id_usuario FROM usuario WHERE email = ?', [email])
    if (usuario.length === 0) return res.status(404).send({ mensagem: 'Nenhuma conta encontrada com este e-mail.' })

    // Verificar se já existe uma solicitação de amizade pendente do usuário solicitado
    const [solicitacao_recebida] = await db.query('SELECT id_solicitacao_amizade FROM solicitacao_amizade WHERE usuario_solicitante = ? AND usuario_solicitado = ? AND pendente = 1 AND ativo = 0', [usuario[0].id_usuario, id_usuario])
    if (solicitacao_recebida.length > 0) return res.status(400).send({ mensagem: 'Esse usuário já lhe enviou uma solicitação de amizade.' })

    // Verificar se já enviou solicitação
    const [solicitacao_amizade] = await db.query('SELECT id_solicitacao_amizade FROM solicitacao_amizade WHERE usuario_solicitante = ? AND usuario_solicitado = ? AND pendente = 1 AND ativo = 0', [id_usuario, usuario[0].id_usuario])
    if (solicitacao_amizade.length > 0) return res.status(400).send({ mensagem: 'Solicitação de amizade já enviada.' })

    // Verificar se já são amigos
    const [amizade_existente] = await db.query('SELECT id_solicitacao_amizade FROM solicitacao_amizade WHERE ((usuario_solicitante = ? AND usuario_solicitado = ?) OR (usuario_solicitado = ? AND usuario_solicitante = ?)) AND ativo = 1', [id_usuario, usuario[0].id_usuario, usuario[0].id_usuario, id_usuario])
    if (amizade_existente.length > 0) return res.status(400).send({ mensagem: 'Vocês já são amigos!' })

    try {
        await db.query('START TRANSACTION')
        const [result] = await db.execute('INSERT INTO solicitacao_amizade (usuario_solicitante, usuario_solicitado) VALUES (?, ?)', [id_usuario, usuario[0].id_usuario])
        await db.execute('UPDATE usuario SET quantidade_solicitacoes_amizade = quantidade_solicitacoes_amizade +1 WHERE id_usuario = ?', [usuario[0].id_usuario])
        await db.query('COMMIT')
        res.send({ mensagem: 'Solicitação de amizade enviada.' })

        try {
            notificacoesSolicitacaoAmizade.notificarNovaSolicitacao(result.insertId)
        }
        catch (error) {
            console.error('Erro ao notificar nova solicitação de amizade: ', error)
        }
    }
    catch (err) {
        await db.query('ROLLBACK')
        console.error(err)
        res.status(500).send({ mensagem: 'Desculpe, houve um erro ao solicitar amizade.' })
    }
})

router.get('/dados', async (req, res) => {
    const { id_usuario } = req

    try {
        const [usuario] = await db.query('SELECT id_usuario, nome_usuario, email, status, data_cadastro FROM usuario WHERE id_usuario = ?', [id_usuario])
        res.send(usuario[0])
    }
    catch (err) {
        console.error(err)
        res.status(500).send({ mensagem: 'Houve um erro ao buscar os dados do usuário' })
    }
})

module.exports = router