const express = require('express')
const app = express()
app.use(express.json())

const helmet = require('helmet')
app.use(helmet())

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const cors = require('cors')
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))

// Rotas
app.use(require('./routes.js'))

const port_app = process.env.PORT_APP
app.listen(port_app, console.log(`Servidor de aplicação rodando na porta ${port_app}`))