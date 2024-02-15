const router = require('express').Router()
const db = require('../config/database')
const gerarJWT = require('../functions/gerarJWT')
const { rateLimit } = require("express-rate-limit")
const bcrypt = require('bcrypt')

const limiter = rateLimit({
    windowMs: 0.25 * 60 * 1000,
    limit: 10,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        mensagem: 'Login bloqueado por 15 segundos'
    }
})

router.post('/', limiter, async (req, res) => {

    const { email, senha } = req.body

    if (!email || !senha) {
        res.status(400).send({ mensagem: 'Informe o e-mail e senha' })
        return
    }

    await db.execute('SELECT id_usuario, nome_usuario, email, senha FROM usuario WHERE email = ?', [email])
        .then(async ([results]) => {

            if (results.length > 0) {

                bcrypt.compare(senha, results[0].senha, async (err, senha_correta) => {

                    if (err) {
                        console.error(err)
                        return res.status(500).send({ mensagem: 'Houve um erro ao comparar as senhas' })
                    }

                    if (senha_correta) {
                        const jwt = await gerarJWT(results[0])

                        if (jwt) {
                            res.cookie('token', String(jwt), {
                                httpOnly: true,
                            })

                            res.send({ mensagem: 'Bem-vindo(a) :)' })

                            return
                        }
                        else return res.status(500).send({ mensagem: 'Houve um erro ao gerar o token' })
                    }
                    else {
                        credenciaisInvalidas()
                    }
                })
            }
            else {
                credenciaisInvalidas()
            }
        })

    function credenciaisInvalidas() {
        res.status(401).send({ mensagem: 'E-mail ou senha incorretos' })
    }
})


module.exports = router