'use strict'

const express = require('express')
const route = express.Router()
const routerController = require('../controllers/routerController')
const routerMiddleware = require('../middlewares/routerMiddleware')

route.post('/:token', routerMiddleware.sendTorouter, routerController.sendToRouter)
route.get('/log/:token', routerMiddleware.selectRoutingProcessLog, routerController.selectRoutingProcessLog)

module.exports = route