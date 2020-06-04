'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

mongoose.connect('mongodb://root:root@13.58.178.5:6000/vroom', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)

app.use(bodyParser.json({limit: `${process.env.REQUEST_LIMIT}`}))
app.use(bodyParser.urlencoded({extended: false, limit: `${process.env.REQUEST_LIMIT}`}))

const subscribers = require('./models/subscribers')
const subscriberLog = require('./models/subscriberLog')
const notificationLog = require('./models/notificationLog')
const routeLog = require('./models/routeLog')

const routerRoute = require('./routes/routerRoute')
const webhookRoute = require('./routes/webhookRoute')

app.use('/route', routerRoute)
app.use('/webhook', webhookRoute)

exports.app = app
exports.database = async () =>
{
    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    
    const adapter = new FileSync('banco.json')
    const db = await low(adapter)
    
    db.defaults({ subscribers: [], subscriberLog: [], notificationLog: [], routeLog: [] }).write()

    return db
}