const db = require('../config/database.js')
const gerarJWT = require('../functions/gerarJWT.js')
const bcrypt = require('bcrypt')

module.exports = async (req, res) => {
    let { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        res.status(422).send({ mensagem: 'Dados obrigatórios não informados' })
        return
    }

    bcrypt.hash(senha, 10, async (err, hash) => {
        if (err) {
            console.error(err)
            res.status(500).send({ mensagem: 'Houve um erro ao cadastrar o usuário' })
            return
        }

        await db.execute('INSERT INTO usuario (nome_usuario, email, senha) VALUES (?, ?, ?)',
            [nome, email, hash])

            .then(async ([results]) => {
                const jwt = await gerarJWT(results.insertId)

                if (!jwt) return res.status(500).send({ mensagem: 'Houve um erro ao gerar o token' })

                res.status(201).send({
                    mensagem: 'Sua conta foi criada',
                    token: jwt
                })
            })
            .catch(err => {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(409).send({ mensagem: 'E-mail já cadastrado' })
                    return
                }
                else {
                    console.error(err)
                    res.status(500).send({ mensagem: 'Houve um erro ao cadastrar o usuário' })
                }
            })
    })
}