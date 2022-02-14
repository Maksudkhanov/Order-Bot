const mongoose = require('mongoose')
const DB_URL = 'mongodb+srv://maksudkhanov:coca-cola@cluster0.xc4cu.mongodb.net/test';

mongoose.connect(DB_URL)

const db = mongoose.connection;

db.on('error', (err) => {
    console.error(`An error has occurred in the connection ${err.message}`)
})

db.on('open', () => {
    console.log(`Connection established succesfully`)
});

module.exports = { db }