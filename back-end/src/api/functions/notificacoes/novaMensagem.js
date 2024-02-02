const { clients } = require('../../../websocket/websocket.js')
const db = require('../../config/database.js')

function notificarRemetente(id_mensagem, id_chat, id_usuario, texto_mensagem, data_hora_mensagem) {

    const ws = clients.get(id_usuario)

    if (ws) {

        ws.forEach((conexao) => {

            if (conexao) {
                conexao.send(JSON.stringify({
                    grupo: 'MENSAGEM_ENVIADA',
                    mensagem: {
                        usuario_remetente: Number(id_usuario),
                        id_mensagem,
                        chat_mensagem: Number(id_chat),
                        texto_mensagem,
                        data_hora_mensagem,
                    }
                }))
            }
        })
    }
}

async function notificarDestinatario(id_mensagem, id_chat, id_usuario, texto_mensagem, data_hora_mensagem) {

    const [usuario] = await db.query('SELECT nome_usuario FROM usuario WHERE id_usuario = ?', [id_usuario])
    if (usuario.length === 0) return

    const [id_participantes_chat] = await db.query('SELECT usuario_participante FROM participante_chat WHERE chat_participante = ? AND usuario_participante != ?',
        [id_chat, id_usuario])

    id_participantes_chat.forEach(element => {
        const ws = clients.get(element.usuario_participante)

        if (ws) {

            ws.forEach((conexao) => {

                if (conexao) {
                    conexao.send(JSON.stringify({
                        grupo: 'MENSAGEM_RECEBIDA',
                        mensagem: {
                            usuario_remetente: Number(id_usuario),
                            id_mensagem,
                            chat_mensagem: Number(id_chat),
                            texto_mensagem,
                            nome_usuario_remetente: usuario[0].nome_usuario,
                            data_hora_mensagem,
                        }
                    }))
                }
            })
        }
    })
}

module.exports = { notificarRemetente, notificarDestinatario }