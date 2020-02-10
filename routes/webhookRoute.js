'use strict'

const express = require('express')
const route = express.Router()
const webhookRoute = require('../controllers/webhookController')

route.post('/', webhookRoute.insert)
route.put('/', webhookRoute.update)
route.delete('/', webhookRoute.delete)

module.exports = route