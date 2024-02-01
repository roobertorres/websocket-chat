const { WebSocketServer } = require('ws')
const cookieParser = require('cookie-parser')
const verificarJWT = require('../api/functions/verificarJWT.js')

const wss = new WebSocketServer({ port: 8080 }, () => console.log('Servidor WebSocket rodando na porta 8080'))

const clients = new Map()

wss.on('connection', async (ws, req) => {

    const parseCookies = cookieParser()
    parseCookies(req, {}, () => { })

    try {
        const id_usuario = await verificarJWT(req.cookies.token)

        if (clients.has(id_usuario)) {
            clients.get(id_usuario).push(ws)
            console.log(`Nova conexão do usuário ${id_usuario}`)
        }
        else {
            clients.set(id_usuario, [ws])
            console.log(`Primeira conexão do usuário ${id_usuario}`)
        }
    }
    catch (err) {
        console.error('Token inválido: ', err)
        ws.send(JSON.stringify({ grupo: 'TOKEN_INVALIDO' }))
        return ws.close()
    }

    ws.on('message', (message) => {
        console.log(message)
    })

    ws.on('close', () => {
        for (let [id_usuario, sockets] of clients) {
            clients.set(id_usuario, sockets.filter(socket => socket !== ws))

            if (clients.get(id_usuario).length === 0) {
                clients.delete(id_usuario)
                console.log(`Todas as conexões do usuário ${id_usuario} foram fechadas`)
            }
            else {
                console.log(`Uma das conexões do usuário ${id_usuario} foi fechada`)
            }
        }
    })
})

module.exports.clients = clients