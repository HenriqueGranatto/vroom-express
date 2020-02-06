'use strict'

const express = require('express')
const route = express.Router()
const vroomController = require('../controllers/vroomController')

route.post('/', vroomController.sendToVroom)

module.exports = route