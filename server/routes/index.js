const Router = require('express')
const router = new Router()
const currencyRouter = require('./currencyRouter')

router.use('/currencies', currencyRouter);

module.exports = router;
