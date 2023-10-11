const express = require('express')
const PORT = process.env.PORT || 8000
const mongoose = require('mongoose')
const router = require('./routes/currencyRouter')
const cors = require('cors')
const axios = require('axios')
const currency = require('./models/Currency')

const app = express();

app.use(express.json());
app.use(cors());

const fetchCurrenciesFromAPI = async () => {
    const response = await axios.get('https://api.nbrb.by/exrates/rates?periodicity=0');
    return response.data;
};

const calculateValueToUSD = (rate, usdRate) => {
    const value = usdRate.Cur_OfficialRate / (rate.Cur_OfficialRate / rate.Cur_Scale);
    return Math.round(value * 10000) / 10000;
};

const saveCurrenciesToDB = async (rates) => {
    await currency.deleteMany({});
    await currency.insertMany(rates);
};

const addBYNtoRates = (rates) => {
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

const getSortedCurrencies = async (sortBy) => {
    const currencies = await getCurrencies();
    return currencies.sort((a, b) => {
        if (typeof a[sortBy] === 'string') {
            return a[sortBy].localeCompare(b[sortBy]);
        }
        return a[sortBy] - b[sortBy];
    });
};

app.get('/currencies/sort/byName', async (req, res) => {
    try {
        const sortedCurrencies = await getSortedCurrencies('Cur_Name');
        res.json(sortedCurrencies);
    } catch (error) {
        console.error('Error fetching and sorting currencies by name:', error);
        res.status(500).send('Failed to fetch and sort currencies by name');
    }
});

app.get('/currencies/sort/byValueToUSD', async (req, res) => {
    try {
        const sortedCurrencies = await getSortedCurrencies('valueToUSD');
        res.json(sortedCurrencies);
    } catch (error) {
        console.error('Error fetching and sorting currencies by valueToUSD:', error);
        res.status(500).send('Failed to fetch and sort currencies by valueToUSD');
    }
});

const getCurrencies = async () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const latestCurrency = await currency.findOne().sort({ createdAt: -1 });

    if (!latestCurrency || latestCurrency.createdAt < twoHoursAgo) {
        let rates = await fetchCurrenciesFromAPI();

        rates = addBYNtoRates(rates);

        const usdRate = rates.find(rate => rate.Cur_Abbreviation === 'USD');
        if (!usdRate) throw new Error("USD rate not found in the API response");

        const ratesWithUSDValue = rates.map(rate => ({
            ...rate,
            valueToUSD: calculateValueToUSD(rate, usdRate),
            createdAt: new Date()
        }));

        await saveCurrenciesToDB(ratesWithUSDValue);

        return ratesWithUSDValue;
    } else {
        return currency.find();
    }
};

app.get('/currencies', async (req, res) => {
    try {
        const currencies = await getCurrencies();
        res.json(currencies);
    } catch (error) {
        console.error('Error fetching currencies:', error);
        res.status(500).send('Failed to fetch currencies');
    }
});

const start = async () => {
    try {
        await mongoose.connect("mongodb+srv://zimirken:Gjad0sa8oirnyrIn@cluster.qdddini.mongodb.net/?retryWrites=true&w=majority")
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e)
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start();