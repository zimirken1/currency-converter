const express = require('express')
const PORT = process.env.PORT || 8000
const mongoose = require('mongoose')
const router = require('./routes/index')
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', router)

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