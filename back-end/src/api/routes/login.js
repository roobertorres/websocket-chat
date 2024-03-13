const router = require('express').Router()
const db = require('../config/database.js')
const gerarJWT = require('../functions/gerarJWT')
const { rateLimit } = require('express-rate-limit')
const bcrypt = require('bcrypt')
const sendEmailConfirmation = require('../functions/emailMessages.ts')

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

	try {
		const [user] = await db.query('SELECT id_usuario, nome_usuario, email, senha, email_confirmed FROM usuario WHERE email = ?', [email])
		if (user.length === 0) return credenciaisInvalidas()

		bcrypt.compare(senha, user[0].senha, async (err, senha_correta) => {

			if (err) {
				console.error(err)
				return res.status(500).send({ mensagem: 'Houve um erro ao comparar as senhas' })
			}

			if (senha_correta) {
				if (!user[0].email_confirmed) {
					const [confirmation] = await db.query('SELECT * FROM user_email_confirmation WHERE user = ?', [user[0].id_usuario])
					if (confirmation.length === 0) {
						await sendEmailConfirmation(user[0].id_usuario, email, user[0].nome_usuario)
					}

					res.send({ requires_confirmation: true })
				}
				else {
					const jwt = await gerarJWT(user[0].id_usuario, user[0].nome_usuario, user[0].email)

					if (jwt) {
						res.cookie('token', String(jwt), {
							httpOnly: true,
						})

						res.send({ mensagem: 'Bem-vindo(a) :)' })
					}
					else return res.status(500).send({ mensagem: 'Houve um erro ao gerar o token' })
				}
			}
			else {
				credenciaisInvalidas()
			}
		})
	}
	catch (error) {
		console.error(error)
		return res.status(500).send({ mensagem: 'Houve um erro ao buscar o usuário' })
	}

	function credenciaisInvalidas() {
		res.status(401).send({ mensagem: 'E-mail ou senha incorretos' })
	}
})


module.exports = router