'use strict'

const http = require('http')
const {app} = require('../app')
require('dotenv').config()

const port = process.env.API_PORT

const server = http.createServer(app)

server.listen(port);
console.log(`Servidor rodando na porta ${port}`);