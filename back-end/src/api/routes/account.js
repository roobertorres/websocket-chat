const router = require('express').Router()
const db = require('../config/database.js')
const fs = require('fs')
const path = require('path')

router.get('/profile', async (req, res) => {
    const { id_usuario } = req

    const [profile] = await db.query('SELECT nome_usuario, email FROM usuario WHERE id_usuario = ?', [id_usuario])
    if (profile.length === 0) res.status(404).send('Usuário não encontrado')

    let base64Image = null
    const photoPath = path.join(__dirname, `../../public/images/user-profile-photo/${id_usuario}.png`)

    try {
        const data = await fs.readFileSync(photoPath)
        base64Image = 'data:image/png;base64,' + Buffer.from(data).toString('base64')
    }
    catch (error) {
        base64Image = null
    }

    res.send({
        name: profile[0].nome_usuario,
        email: profile[0].email,
        photo: base64Image,
    })
})

router.patch('/profile', async (req, res) => {
    const { id_usuario } = req
    const { name, photo } = req.body

    const [user] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario])
    if (user.length === 0) res.status(404).send('Usuário não encontrado')

    try {
        await db.query('START TRANSACTION')
        await db.query('UPDATE usuario SET nome_usuario = ? WHERE id_usuario = ?', [name, id_usuario])
        await db.query('COMMIT')
    }
    catch (error) {
        await db.query('ROLLBACK')
        return res.status(500).send('Erro ao atualizar perfil')
    }

    if (photo) {
        const photoPath = path.join(__dirname, `../../public/images/user-profile-photo/${id_usuario}.png`)
        fs.writeFile(photoPath, photo.replace(/^data:image\/png;base64,/, ""), { encoding: 'base64' }, (error) => {
            if (error) {
                return res.status(500).send('Erro ao salvar imagem')
            }
        })
    }
    else {
        try {
            const photoPath = path.join(__dirname, `../../public/images/user-profile-photo/${id_usuario}.png`)
            await fs.unlinkSync(photoPath)
        }
        catch (error) {
            // Imagem não encontrada
        }
    }

    res.send({ message: 'Perfil atualizado' })
})

module.exports = router