const db = require('../config/database.js')
const nodemailer = require('nodemailer')
const emailConfirmationMessage = require('./emailMessages/emailConfirmationMessage')

module.exports = async function sendEmailConfirmation(user_id: number, email: string = '', user_name: string = ''): Promise<void> {
	const confirmation_code: number = Math.floor(Math.random() * 90000) + 10000

	try {
		await db.execute(`
		    INSERT INTO
		        user_email_confirmation_request (user, confirmation_code, request_date)
		    VALUES
		        (?, ?, ?)
		    ON DUPLICATE KEY UPDATE
		        confirmation_code = VALUES(confirmation_code), 
		       request_date = ?
     `, [user_id, confirmation_code, new Date(), new Date()])

		await sendEmail(email, emailConfirmationMessage(confirmation_code, user_name))
	} catch (error) {
		console.log(error)
	}
}

async function sendEmail(email: string, mail_content: string): Promise<void> {
	let transporter = nodemailer.createTransport({
		service: 'smtp',
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		}
	})

	try {
		await transporter.sendMail({
			from: {
				name: process.env.SMTP_SENDER_NAME,
				address: process.env.SMTP_SENDER_EMAIL,
			},
			to: email,
			subject: 'Confirme seu e-mail',
			html: mail_content,
		})

	} catch (error) {
		console.log(error)
		throw new Error('Não foi possível enviar o e-mail de confirmação.')
	}
}