const { clients } = require('../../../websocket/websocket.js')
const db = require('../../config/database.js')

module.exports = async function notificarMensagensLidas(messages) {

    const remetentes = new Map()

    for (const id_mensagem of messages) {
        const sender = await fetchMessageSender(id_mensagem)

        if (remetentes.has(sender)) {
            remetentes.get(sender).push(id_mensagem)
        }
        else {
            remetentes.set(sender, [id_mensagem])
        }
    }

    const ws = clients.get(id_usuario)

    if (ws) {
        ws.forEach((conexao) => {
            if (conexao) {
                conexao.send(JSON.stringify({
                    grupo: 'MENSAGEM',
                    tipo: 'LIDA',
                    mensagem: {
                        id_mensagem: Number(id_mensagem)
                    }
                }))
            }
        })
    }
}

async function fetchMessageSender(id_mensagem) {
    const [sender] = await db.query('SELECT usuario_remetente FROM mensagem WHERE id_mensagem = ?', [id_mensagem])
    return sender[0].id_usuario_remetente
}