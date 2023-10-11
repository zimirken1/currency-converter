const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    Cur_ID: Number,
    Date: String,
    Cur_Abbreviation: String,
    Cur_Scale: Number,
    Cur_Name: String,
    Cur_OfficialRate: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    valueToUSD: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('Currency', currencySchema);

