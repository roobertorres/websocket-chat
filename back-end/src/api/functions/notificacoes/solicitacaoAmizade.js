const { clients } = require('../../../websocket/websocket.js')
const db = require('../../config/database.js')

module.exports = async function notificarNovaSolicitacao(id) {

    const [solicitacao] = await buscarSolicitacoes(id)
    if (solicitacao.length === 0) return

    const { id_usuario_solicitante, id_usuario_solicitado } = solicitacao[0]

    notificarUsuario(id_usuario_solicitante, 'SOLICITACAO_AMIZADE', 'ENVIADA', solicitacao)
    notificarUsuario(id_usuario_solicitado, 'SOLICITACAO_AMIZADE', 'NOVO', solicitacao)
}

module.exports = async function notificarSolicitacaoRecusada(id) {

    const [solicitacao] = await buscarSolicitacoes(id)
    if (solicitacao.length === 0) return

    const { id_usuario_solicitante, id_usuario_solicitado } = solicitacao[0]
    notificarUsuario(id_usuario_solicitante, 'SOLICITACAO_AMIZADE', 'RECUSADA', solicitacao)
    notificarUsuario(id_usuario_solicitado, 'SOLICITACAO_AMIZADE', 'RECUSOU', solicitacao)
}

module.exports = async function notificarSolicitacaoAceita(id) {

    const [solicitacao] = await buscarSolicitacoes(id)
    if (solicitacao.length === 0) return

    const { id_usuario_solicitante, id_usuario_solicitado } = solicitacao[0]
    notificarUsuario(id_usuario_solicitante, 'SOLICITACAO_AMIZADE', 'ACEITA', solicitacao)
    notificarUsuario(id_usuario_solicitado, 'SOLICITACAO_AMIZADE', 'ACEITOU', solicitacao)
}

function notificarUsuario(id, grupo, tipo, solicitacao) {
    const ws = clients.get(id)

    if (ws) {
        ws.forEach((conexao) => {
            if (conexao) {
                conexao.send(JSON.stringify({
                    grupo,
                    tipo,
                    solicitacao,
                }))
            }
        })
    }
}

async function buscarSolicitacoes(id) {
    return await db.query(
        `
    SELECT
        id_solicitacao_amizade,
        usuario_solicitante.id_usuario AS id_usuario_solicitante,
        usuario_solicitante.nome_usuario AS nome_usuario_solicitante,
        usuario_solicitado.id_usuario AS id_usuario_solicitado,
        usuario_solicitado.nome_usuario AS usuario_solicitado_nome
    FROM
        solicitacao_amizade
    INNER JOIN
        usuario AS usuario_solicitante ON solicitacao_amizade.usuario_solicitante = usuario_solicitante.id_usuario
    INNER JOIN
        usuario AS usuario_solicitado ON solicitacao_amizade.usuario_solicitado = usuario_solicitado.id_usuario
    WHERE
        id_solicitacao_amizade = ?
        `,
        [id])
}