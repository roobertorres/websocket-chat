import * as db from '../config/database.js'
import * as nodemailer from 'nodemailer'
import emailConfirmationMessage from './emailMessages/emailConfirmationMessage'

export async function emailConfirmation(user_id: number): Promise<void> {
	const confirmation_code: number = Math.floor(Math.random() * 90000) + 10000

	try {
		await db.execute(`
		    INSERT INTO
		        user_email_confirmation (user, confirmation_code, alter_request_date)
		    VALUES
		        (?, ?, ?)
		    ON DUPLICATE KEY UPDATE
		        confirmation_code = VALUES(confirmation_code), 
		        alter_request_date = ?
     `, [user_id, confirmation_code, new Date(), new Date()])

		const [user] = await db.query('SELECT email, nome_usuario FROM usuario WHERE id_usuario = ?', [user_id])
		if (Array.isArray(user) && user.length > 0) await sendEmail(user[0].email, emailConfirmationMessage(confirmation_code, user[0]?.nome_usuario))
	} catch (error) {
		console.log(error)
	}
}

async function sendEmail(email: string, mail_content: string): Promise<Boolean> {
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
		return false
	}

	return true
}