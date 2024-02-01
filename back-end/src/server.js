require('dotenv').config()

const requiredEnv = [
    'PORT_WS',
    'PORT_APP',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASS'
]

requiredEnv.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Erro: a variável de ambiente ${envVar} não foi definida.`);
    }
})

try {
    const db = require('./api/config/database.js') // Banco de dados
}
catch (err) {
    console.error(err)
    process.exit(1)
}

require('./api/api.js') // Servidor de API
require('./websocket/websocket.js') // Servidor de WebSocket
