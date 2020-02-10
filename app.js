'use strict'

const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const vroomRoute = require('./routes/vroomRoute')
const webhookRoute = require('./routes/webhookRoute')

app.use('/vroom', vroomRoute)
app.use('/webhook', webhookRoute)

exports.app = app
exports.database = async () =>
{
    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    
    const adapter = new FileSync('db.json')
    const db = await low(adapter)
    
    db.defaults({ subscribers: [] }).write()

    return db
}