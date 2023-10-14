const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;

const router = require('./routes/index');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', router);

const start = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start();
