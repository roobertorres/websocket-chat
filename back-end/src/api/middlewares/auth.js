const jose = require('jose')

module.exports = async (req, res, next) => {

    if (!req.cookies.token) {
        res.status(401).send({ mensagem: 'Token não informado' })
        return
    }

    const secret = new TextEncoder().encode('batata')

    try {
        const { payload } = await jose.jwtVerify(req.cookies.token.replace('Bearer '), secret, {
            issuer: 'TORRES',
        })

        if (payload.id_usuario) {
            req.id_usuario = payload.id_usuario
            req.nome_usuario = payload.nome_usuario
            req.email = payload.email
        }
        else {
            res.status(401).send({ mensagem: 'Token inválido' })
            return
        }
    }
    catch (err) {
        if (err.code) {
            console.error(err.code)
            res.status(401).send({ mensagem: 'Token inválido' })
            return
        }
        else {
            console.error(err)
            res.status(500).send({ mensagem: 'Houve um problema ao verificar o token' })
            return
        }
    }

    next()
}