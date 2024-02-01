const jose = require('jose')

module.exports = async function gerarJWT(usuario) {
    const secret = new TextEncoder().encode('batata')
    const alg = 'HS256'

    const jwt = await new jose.SignJWT({
        'id_usuario': usuario.id_usuario,
        'nome_usuario': usuario.nome_usuario,
        'email': usuario.email,
    })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('TORRES')
        .setExpirationTime('2h')
        .sign(secret)

        .catch(err => {
            console.error(err)
            return false
        })

    return jwt
}