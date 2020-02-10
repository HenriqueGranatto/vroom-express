'use strict'

const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const db = new JsonDB(new Config("vroom", true, false, '/'));

const vroomRoute = require('./routes/vroomRoute')
const webhookRoute = require('./routes/webhookRoute')

app.use('/vroom', vroomRoute)
app.use('/webhook', webhookRoute)

module.exports = {app, db}