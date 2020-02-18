'use strict'

const express = require('express')
const route = express.Router()
const vroomController = require('../controllers/vroomController')
const vroomMiddleware = require('../middlewares/vroomMiddleware')

route.post('/:token', vroomMiddleware.sendToVroom, vroomController.sendToVroom)
route.get('/log/:token', vroomMiddleware.selectRoutingProcessLog, vroomController.selectRoutingProcessLog)

module.exports = route