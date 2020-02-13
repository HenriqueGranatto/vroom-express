'use strict'

const express = require('express')
const route = express.Router()
const webhookRoute = require('../controllers/webhookController')
const webhookMiddleware = require('../middlewares/webhookMiddleware')

route.get('/:token',    webhookMiddleware.select, webhookRoute.select)
route.post('/:token',   webhookMiddleware.insert, webhookRoute.insert)
route.put('/:token',    webhookMiddleware.update, webhookRoute.update)
route.delete('/:token', webhookMiddleware.delete, webhookRoute.delete)

module.exports = route