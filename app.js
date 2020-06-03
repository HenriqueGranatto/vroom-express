'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

mongoose.connect('mongodb://nodejs:node123@ds263161.mlab.com:63161/nodejs', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)

app.use(bodyParser.json({limit: `${process.env.REQUEST_LIMIT}`}))
app.use(bodyParser.urlencoded({extended: false, limit: `${process.env.REQUEST_LIMIT}`}))

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