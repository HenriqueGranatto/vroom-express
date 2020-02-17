'use strict'

const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

app.use(bodyParser.json({limit: `${process.env.REQUEST_LIMIT}`}))
app.use(bodyParser.urlencoded({extended: false, limit: `${process.env.REQUEST_LIMIT}`}))

const vroomRoute = require('./routes/vroomRoute')
const webhookRoute = require('./routes/webhookRoute')

app.use('/route', vroomRoute)
app.use('/notification', webhookRoute)

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