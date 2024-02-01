const router = require('express').Router()

router.get('/', (req, res) => {
    res.clearCookie('token')
    res.send()
})

module.exports = router