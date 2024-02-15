const jose = require('jose')

module.exports = async (token) => {
    const secret = new TextEncoder().encode(process.env.JWT_ENCODE_KEY)

    try {
        const result = await jose.jwtVerify(token, secret, {
            issuer: 'TORRES',
        })

        if (result.payload.id_usuario) {
            return result.payload.id_usuario
        }
        else {
            throw new Error('Token inválido')
        }
    }
    catch (err) {
        if (err.code) {
            console.error(err.code)
            throw new Error('Token inválido')
        }
    }
}