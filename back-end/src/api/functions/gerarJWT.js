const jose = require('jose')

module.exports = async function gerarJWT(id, name, email) {
    const secret = new TextEncoder().encode(process.env.JWT_ENCODE_KEY)
    const alg = 'HS256'

    const jwt = await new jose.SignJWT({
        'id_usuario': id,
        'nome_usuario': name,
        'email': email,
    })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('TORRES')
        .setExpirationTime('30d')
        .sign(secret)

        .catch(err => {
            console.error(err)
            return false
        })

    return jwt
}