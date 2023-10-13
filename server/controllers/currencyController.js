const axios = require("axios");
const currency = require("../models/Currency");

class CurrencyController {
    fetchCurrenciesFromAPI = async () => {
        const response = await axios.get('https://api.nbrb.by/exrates/rates?periodicity=0');
        return response.data;
    };

    calculateValueToUSD = (rate, usdRate) => {
        const value = usdRate.Cur_OfficialRate / (rate.Cur_OfficialRate / rate.Cur_Scale);
        return Math.round(value * 10000) / 10000;
    };

    saveCurrenciesToDB = async (rates) => {
        await currency.deleteMany({});
        await currency.insertMany(rates);
    };

    addBYNtoRates = (rates) => {
        return [
            ...rates,
            {
                Cur_ID: 0,
                Cur_ParentID: 0,
                Cur_Code: "933",
                Cur_Abbreviation: "BYN",
                Cur_Name: "Белорусский рубль",
                Cur_EngName: "Belarusian Ruble",
                Cur_QuotName: "1 Белорусский рубль",
                Cur_QuotName_Bel: "1 Белорусский рубль",
                Cur_QuotName_Eng: "1 Belarusian Ruble",
                Cur_Name_Bel: "Беларускі рубель",
                Cur_Name_Eng: "Belarusian Ruble",
                Cur_Scale: 1,
                Cur_Periodicity: 0,
                Cur_DateEnd: "2999-12-31T00:00:00+03:00",
                Cur_DateStart: "1700-01-01T00:00:00+03:00",
                Cur_OfficialRate: 1
            }
        ];
    };

    getSortedCurrencies = async (sortBy) => {
        const currencies = await this.getCurrencies();
        return currencies.sort((a, b) => {
            if (typeof a[sortBy] === 'string') {
                return a[sortBy].localeCompare(b[sortBy]);
            }
            return a[sortBy] - b[sortBy];
        });
    };

    getCurrencies = async () => {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const latestCurrency = await currency.findOne().sort({createdAt: -1});

        if (!latestCurrency || latestCurrency.createdAt < twoHoursAgo) {
            let rates = await this.fetchCurrenciesFromAPI();

            rates = this.addBYNtoRates(rates);

            const usdRate = rates.find(rate => rate.Cur_Abbreviation === 'USD');
            if (!usdRate) throw new Error("USD rate not found in the API response");

            const ratesWithUSDValue = rates.map(rate => ({
                ...rate,
                valueToUSD: this.calculateValueToUSD(rate, usdRate),
                createdAt: new Date()
            }));

            await this.saveCurrenciesToDB(ratesWithUSDValue);

            return ratesWithUSDValue;
        } else {
            return currency.find();
        }
    };

    getAllCurrencies = async (req, res) => {
        try {
            const currencies = await this.getCurrencies();
            res.json(currencies);
        } catch (error) {
            console.error('Error fetching currencies:', error);
            res.status(500).send('Failed to fetch currencies');
        }
    }

    getAllSortedCurrenciesByName = async (req, res) => {
        try {
            const sortedCurrencies = await this.getSortedCurrencies('Cur_Name');
            res.json(sortedCurrencies);
        } catch (error) {
            console.error('Error fetching and sorting currencies by name:', error);
            res.status(500).send('Failed to fetch and sort currencies by name');
        }
    }

    getAllSortedCurrenciesByValue = async (req, res) => {
        try {
            const sortedCurrencies = await this.getSortedCurrencies('valueToUSD');
            res.json(sortedCurrencies);
        } catch (error) {
            console.error('Error fetching and sorting currencies by valueToUSD:', error);
            res.status(500).send('Failed to fetch and sort currencies by valueToUSD');
        }
    }

    convertCurrency = async (req, res) => {
        try {
            const currencyToConvert = req.params.currency;
            const value = req.body.value;

            const rates = await this.getCurrencies();
            const targetCurrency = rates.find(rate => rate.Cur_Abbreviation === currencyToConvert);

            if (!targetCurrency) {
                return res.status(400).send('Currency not found');
            }

            const conversionResult = {};
            rates.forEach(rate => {
                conversionResult[rate.Cur_Abbreviation] = value * rate.valueToUSD;
            });

            res.json(conversionResult);

        } catch (error) {
            console.error('Error converting currency:', error);
            res.status(500).send('Failed to convert currency');
        }
    }

    convert = async (req, res) => {
        try {
            const requiredCurrencies = req.query.currencies.split(','); // Преобразовываем строку в массив
            const currencies = await this.getCurrencies();
            const filteredCurrencies = currencies.filter(currency => requiredCurrencies.includes(currency.Cur_Abbreviation));
            res.json(filteredCurrencies);
        } catch (error) {
            console.error('Error fetching specific currencies:', error);
            res.status(500).send('Failed to fetch specific currencies');
        }
    }

}

module.exports = new CurrencyController();