const { clients } = require('../../../websocket/websocket.js')
const db = require('../../config/database.js')

async function notificarSolicitacaoCancelada(id) {
    const solicitacao = await buscarSolicitacoes(id)

    if (solicitacao) {
        const { id_usuario_solicitante, id_usuario_solicitado } = solicitacao
        notificarUsuario(id_usuario_solicitante, 'SOLICITACAO_AMIZADE', 'CANCELAR_ENVIADA', solicitacao)
        notificarUsuario(id_usuario_solicitado, 'SOLICITACAO_AMIZADE', 'CANCELAR_RECEBIDA', solicitacao)
    }
}

async function notificarNovaSolicitacao(id) {

    const solicitacao = await buscarSolicitacoes(id)
    if (solicitacao) {
        const { id_usuario_solicitante, id_usuario_solicitado } = solicitacao
        notificarUsuario(id_usuario_solicitante, 'SOLICITACAO_AMIZADE', 'ENVIADA', solicitacao)
        notificarUsuario(id_usuario_solicitado, 'SOLICITACAO_AMIZADE', 'RECEBIDA', solicitacao)
    }
}

async function notificarSolicitacaoRecusada(id) {

    const solicitacao = await buscarSolicitacoes(id)
    if (solicitacao) {
        const { id_usuario_solicitante, id_usuario_solicitado } = solicitacao
        notificarUsuario(id_usuario_solicitante, 'SOLICITACAO_AMIZADE', 'RECUSADA', solicitacao)
        notificarUsuario(id_usuario_solicitado, 'SOLICITACAO_AMIZADE', 'RECUSOU', solicitacao)
    }
}

async function notificarSolicitacaoAceita(id) {

    const solicitacao = await buscarSolicitacoes(id)
    if (solicitacao) {
        const { id_usuario_solicitante, id_usuario_solicitado } = solicitacao
        notificarUsuario(id_usuario_solicitante, 'SOLICITACAO_AMIZADE', 'ACEITA', solicitacao)
        notificarUsuario(id_usuario_solicitado, 'SOLICITACAO_AMIZADE', 'ACEITOU', solicitacao)
    }
}


module.exports = {
    notificarNovaSolicitacao,
    notificarSolicitacaoRecusada,
    notificarSolicitacaoAceita,
    notificarSolicitacaoCancelada
}

function notificarUsuario(id, grupo, tipo, solicitacao) {
    const ws = clients.get(id)

    if (ws) {

        ws.forEach((conexao) => {
            if (conexao) {
                conexao.send(JSON.stringify({
                    grupo,
                    tipo,
                    solicitacao: {
                        id_solicitacao_amizade: solicitacao.id_solicitacao_amizade,
                        nome_usuario_solicitante: solicitacao.nome_usuario_solicitante,
                        email_usuario_solicitante: solicitacao.email_usuario_solicitante,
                        nome_usuario_solicitado: solicitacao.nome_usuario_solicitado,
                        email_usuario_solicitado: solicitacao.email_usuario_solicitado,
                    },
                }))
            }
        })
    }
}

async function buscarSolicitacoes(id) {
    const [result] = await db.query(
        `
    SELECT
        id_solicitacao_amizade,
        usuario_solicitante.id_usuario AS id_usuario_solicitante,
        usuario_solicitante.nome_usuario AS nome_usuario_solicitante,
        usuario_solicitante.email AS email_usuario_solicitante,
        usuario_solicitado.id_usuario AS id_usuario_solicitado,
        usuario_solicitado.nome_usuario AS nome_usuario_solicitado,
        usuario_solicitado.email AS email_usuario_solicitado
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
    console.log(result)

    return result
}