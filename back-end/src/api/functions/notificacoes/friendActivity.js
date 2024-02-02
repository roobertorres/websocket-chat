const { clients } = require('../../../websocket/websocket.js')
const db = require('../../config/database.js')

module.exports = async (id_usuario, status) => {
    const [amigos] = await db.query(`
    SELECT
        usuario_solicitante
    AS
        id_usuario
    FROM
        solicitacao_amizade
    WHERE
        usuario_solicitado = ?
    UNION
    SELECT
        usuario_solicitado
    FROM
        solicitacao_amizade
    WHERE
        usuario_solicitante = ?
    `, [id_usuario, id_usuario])

    if (amigos.length > 0) {

        amigos.forEach(amigo => {

            const ws = clients.get(amigo.id_usuario)

            if (ws) {
                ws.forEach(conexao => {
                    conexao.send(JSON.stringify({
                        grupo: 'FRIEND_ACTIVITY',
                        tipo: status,
                        id_usuario
                    }))
                })
            }
        })
    }

    if (status === 'OFFLINE') {

        try {
            const [status_atual] = await db.query(`SELECT status FROM usuario WHERE id_usuario = ?`, [id_usuario])


            await db.query('START TRANSACTION')
            await db.execute(`
                UPDATE
                    usuario
                SET
                    status = ?,
                    ultimo_status = ?
                WHERE
                    id_usuario = ?

            `, [status, status_atual[0].status, id_usuario])

            await db.query('COMMIT')
        }
        catch (error) {
            await db.query('ROLLBACK')
            console.log(error)
        }
    }
    else {
        try {
            await db.query('START TRANSACTION')
            await db.execute(`
                UPDATE
                    usuario
                SET
                    status = ?,
                    ultimo_status = ?
                WHERE
                    id_usuario = ?

            `, [status, status, id_usuario])

            await db.query('COMMIT')
        }
        catch (error) {
            await db.query('ROLLBACK')
            console.log(error)
        }
    }
}