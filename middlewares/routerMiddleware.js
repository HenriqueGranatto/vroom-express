'use strict'

// IMPORTANDO OS MÓDULOS NECESSÁRIOS
require('dotenv').config()
const helper = require('../helpers/helper')
const routerHelper = require('../helpers/routerHelper')

/** MIDDLEWARE DA ROTA QUE RECEBE O PROBLEMA A SER ROTEIRIZADO */
exports.sendTorouter = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {                
        /** VALIDA SE TODOS OS DADOS NECESSÁRIOS FORAM ENVIADOS */
        const verifyRequestData = routerHelper.verifyRequestData(request.body)

        /** RETORNA ERRO CASO HAJA UM PROBLEMA COM O PAYLOAD */
        if(verifyRequestData.status == 400) 
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Request params bad formatted", errors: verifyRequestData.message})
            return
        }

        next()
    }
    catch(error)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Cannot possible process the request"})
        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_RECEIVED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), errors: error})
        return
    }
}

/** MIDDLEWARE DA ROTA DE CONSULTA DE STATUS DE ROTEIRIZAÇÃO */
exports.selectRoutingProcessLog = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {      
        /** VALIDA SE TODOS OS DADOS NECESSÁRIOS FORAM ENVIADOS */
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])

        /** RETORNA ERRO CASO HAJA UM PROBLEMA COM O PAYLOAD */
        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Request params bad formatted", errors: verifyRequestParamsData.errors})
            return
        }

        next()
    }
    catch(error)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Cannot possible process the request"})
        return
    }
}