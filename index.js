console.clear()

const express = require('express')
const cors = require('cors')
const router = require('./router')
const mongoose = require('mongoose')

require('dotenv').config()

console.log(process.env.MONGO_URL)

const PORT = process.env.PORT || 3000
const BBDD_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/exchangeP2P'

const connect = async () => {
    await mongoose.connect(BBDD_URL)
    .then(() => {console.log('Conectado a MongoDB')})
    .catch(error => console.log('Error al conectar a MongoDB:', error))
}

connect()

const app = express()

app.use( cors() )
app.use( express.json())
app.use( express.urlencoded({extended:false}))


app.use( router )


app.listen(PORT, () => {console.log('API Iniciada')})