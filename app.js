const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/details', require('./routes/details.routes'));
// app.use('/t', require('./routes/redirect.routes'));

// const PORT = config.get('port') || 5000;
const PORT = 5000;
const MONGO_URI = "mongodb+srv://alexey:12345@cluster0.tleee.mongodb.net/app?retryWrites=true&w=majority";


async function start() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => {
            console.log(`App has been started on port ${PORT}...`);
        });
    } catch (e) {
        console.log('Server error ', e.message);
        process.exit(1);
    }
}

start();
