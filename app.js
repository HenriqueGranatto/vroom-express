'use strict'

/** IMPORTANDO MÓDULOS NECESSÁRIOS */
const express = require('express')
const mongoose = require('mongoose')
const apm = require('elastic-apm-node')
const bodyParser = require('body-parser')
require('dotenv').config()

/** INICIANDO SERVIDOR */
const app = express()

/** CONECTANDO API AO MONGO PARA SALVAR LOGS */
mongoose.connect(`mongodb://root:root@${process.env.SUBDOMAIN_ADDRESS}:6000/vroom?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)

app.use(bodyParser.json({limit: `${process.env.REQUEST_LIMIT}`}))
app.use(bodyParser.urlencoded({extended: false, limit: `${process.env.REQUEST_LIMIT}`}))

/** IMPORTANDO MODELS DOS LOGS */
const subscribers = require('./models/subscribers')
const subscriberLog = require('./models/subscriberLog')
const notificationLog = require('./models/notificationLog')
const routeLog = require('./models/routeLog')

/** IMPORTANDO ROTAS */
const routerRoute = require('./routes/routerRoute')
const webhookRoute = require('./routes/webhookRoute')

/** DEFININDO AS ROTAS */
app.use('/route', routerRoute)
app.use('/webhook', webhookRoute)

/** APM Agent */
apm.start({
    serviceName: 'vroom',
    secretToken: `${process.env.APM_TOKEN}`,
    serverUrl: `${process.env.APM_HOST}`
})

exports.app = app
exports.apm = apm;