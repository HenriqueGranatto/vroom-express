'use strict'

const express = require('express')
const route = express.Router()
const webhookRoute = require('../controllers/webhookController')

route.post('/', webhookRoute.insert)

module.exports = route