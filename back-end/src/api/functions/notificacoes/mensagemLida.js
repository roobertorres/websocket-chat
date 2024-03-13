const { clients } = require('../../../websocket/websocket.js')
const db = require('../../config/database.js')

module.exports = async function notificarMensagensLidas(messages) {

	const remetentes = new Map()

	for (const mensagem of messages) {

		if (remetentes.has(mensagem.usuario_remetente)) {
			remetentes.get(mensagem.usuario_remetente).push(mensagem)
		}
		else {
			remetentes.set(mensagem.usuario_remetente, [mensagem])
		}
	}

	for (const [id_usuario, mensagens] of remetentes) {

		const ws = clients.get(id_usuario)

		if (ws) {
			console.log('conexão encontrada')
			ws.forEach((conexao) => {
				if (conexao) {
					conexao.send(JSON.stringify({
						grupo: 'MENSAGEM',
						tipo: 'LIDA',
						mensagens,
					}))
				}
			})
		}
		else {
			console.log('nenhuma conexão encontrada')
		}
	}
}