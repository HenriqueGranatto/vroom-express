'use strict'

/** IMPORTANDO MÓDULOS NECESSÁRIOS */
const express = require('express')
const route = express.Router()
const routerController = require('../controllers/routerController')
const routerMiddleware = require('../middlewares/routerMiddleware')

/** ROTAS DA ROTEIRIZAÇÃO */
route.post('/:token', routerMiddleware.sendTorouter, routerController.sendToRouter)
route.post('/sync/:token', routerMiddleware.sendTorouter, routerController.sendToRouterSync)
route.get('/log/:token', routerMiddleware.selectRoutingProcessLog, routerController.selectRoutingProcessLog)

module.exports = route