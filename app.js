'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const vroomRoute = require('./routes/vroomRoute')

app.use('/vroom', vroomRoute)

module.exports = app