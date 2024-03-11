const router = require('express').Router()
const db = require('../config/database')
const sendEmailConfirmation = require('../functions/sendEmailMessage')
const gerarJwt = require('../functions/gerarJWT')
router.post('/resend-confirmation-code', async (req, res) => {
	const { email } = req.body

	if (!email) res.status(422).send('Informe o e-mail')

	const [user] = await db.query('SELECT id_usuario, nome_usuario FROM usuario WHERE email = ?', [email])
	if (user.length === 0) res.status(404).send('Não foi encontrado um usuário com o e-mail informado')

	const [last_request] = await db.query('SELECT alter_request_date FROM user_email_confirmation WHERE user = ?', [user[0].id_usuario])
	if (last_request.length > 0) {
		const lastRequestDate = new Date(last_request[0].alter_request_date)
		const now = new Date()
		const diff = now - lastRequestDate
		if (diff < 60000) return res.status(429).send({ message: 'Um código já foi enviado recentemente. Aguarde alguns minutos para solicitar um novo código.' })
	}

	await sendEmailConfirmation(user[0].id_usuario, email, user[0].nome_usuario)
	res.send({ message: 'O código foi reenviado' })
})

router.put('/confirm-email', async (req, res) => {
	const { email } = req.body
	const { code } = req.body

	if (!email) return res.status(422).send({ message: 'Informe o e-mail' })
	if (!code) return res.status(422).send({ message: 'Informe o código' })

	const [user] = await db.query('SELECT id_usuario FROM usuario WHERE email = ?', [email])
	if (user.length === 0) return res.status(404).send('Usuário não encontrado')

	const [confirmation] = await db.query('SELECT * FROM user_email_confirmation WHERE user = ? AND confirmed = 0', [user[0].id_usuario])
	if (confirmation.length === 0) return res.status(404).send({ message: 'Esta conta já possui o e-mail confirmado' })
	console.log('confirmação', confirmation[0])
	if (String(confirmation[0].confirmation_code) !== String(code)) return res.status(401).send({ message: 'Código inválido' })

	try {
		await db.query('START TRANSACTION')
		await db.query('UPDATE user_email_confirmation SET confirmed = 1, confirmation_date = ? WHERE user = ?', [new Date(), user[0].id_usuario])
		await db.query('UPDATE usuario SET email_confirmed = 1 WHERE id_usuario = ?', [user[0].id_usuario])
		await db.query('COMMIT')

		const jwt = await gerarJwt(user[0].id_usuario, email, user[0].nome_usuario)
		if (!jwt) return res.status(500).send({ message: 'Erro ao gerar token' })

		res.cookie('token', String(jwt), {
			httpOnly: true,
		})

		res.send({ message: 'E-mail confirmado' })
	}
	catch (error) {
		await db.query('ROLLBACK')
		console.log(error)
		return res.status(500).send({ message: 'Erro ao confirmar e-mail' })
	}
})

module.exports = router