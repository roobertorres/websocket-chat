const db = require('../config/database.js')
const gerarJWT = require('../functions/gerarJWT.js')
const bcrypt = require('bcrypt')
const sendEmailConfirmation = require('../functions/sendEmailConfirmation.js')

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

        try {
            await db.query('START TRANSACTION')
            const [user] = await db.execute('INSERT INTO usuario (nome_usuario, email, senha, data_cadastro) VALUES (?, ?, ?, ?)', [nome, email, hash, new Date()])

            await sendEmailConfirmation(user.insertId, email, nome)

            res.status(201).send({
                mensagem: 'Conta criada! :)'
            })

            await db.query('COMMIT')
        }
        catch (error) {
            await db.query('ROLLBACK')

            if (error.code === 'ER_DUP_ENTRY') {
                res.status(409).send({ mensagem: 'E-mail já cadastrado' })
            }
            else {
                console.error(error)
                res.status(500).send({ mensagem: 'Houve um erro ao cadastrar o usuário' })
            }
        }
    })
}