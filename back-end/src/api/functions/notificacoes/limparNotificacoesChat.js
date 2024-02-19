const { clients } = require('../../../websocket/websocket.js')

module.exports = function limparNotificacoesChat(id_usuario, id_chat) {
    const ws = clients.get(id_usuario)

    if (ws) {
        ws.forEach((conexao) => {
            if (conexao) {
                conexao.send(JSON.stringify({
                    grupo: 'LIMPAR_NOTIFICACOES_CHAT',
                    id_chat: Number(id_chat),
                }))
            }
        })
    }
}