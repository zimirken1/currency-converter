const Router = require('express')
const currencyController = require("../controllers/currencyController");
const router = new Router()

router.get('/sort/byName', currencyController.getAllSortedCurrenciesByName);
router.get('/sort/byValueToUSD', currencyController.getAllSortedCurrenciesByValue);
router.get('/', currencyController.getAllCurrencies);
router.post('/convert/:currency', currencyController.convertCurrency);
router.get('/convert', currencyController.convert)

module.exports = router