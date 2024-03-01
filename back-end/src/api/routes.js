const router = require('express').Router()

router.use('/login', require('./routes/login.js'))
router.use('/criar-conta', require('./routes/criar-conta.js'))
router.use('/email-verification', require('./routes/email-verification.js'))

router.use('/logout', require('./middlewares/auth.js'), require('./routes/logout.js'))
router.use('/usuario', require('./middlewares/auth.js'), require('./routes/usuario.js'))
router.use('/chat', require('./middlewares/auth.js'), require('./routes/chat.js'))
router.use('/account', require('./middlewares/auth.js'), require('./routes/account.js'))

// Rota não encontrada
router.use((req, res, next) => {
    res.status(404).send({ mensagem: 'Rota não encontrada' });
})

module.exports = router
