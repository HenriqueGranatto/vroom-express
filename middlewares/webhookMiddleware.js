'use strict'

// IMPORTANDO OS MÓDULOS NECESSÁRIOS
require('dotenv').config()
const helper = require('../helpers/helper')
const webhookHelper = require('../helpers/webhookHelper')

/** MIDDLEWARE DA ROTA DE CONSULTA A URL'S DE NOTIFICAÇÃO CADASTRADAS */
exports.select = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {    
        /** VALIDA SE TODOS OS DADOS NECESSÁRIOS FORAM ENVIADOS */
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])

        /** RETORNA ERRO CASO HAJA UM PROBLEMA COM O PAYLOAD */
        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), errors: verifyRequestParamsData.errors})
            await helper.insertInDB("subscriberLog", {event: "SELECT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        next()
    }
    catch(error)
    {
        /** ENVIA UM LOG PARA O APM DO ELASTIC E RETORNA ERRO */
        app.apm.captureError(error)
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "SELECT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: error})
        return
    }
}

/** MIDDLEWARE DA ROTA CADASTRO DE URL'S DE NOTIFICAÇÃO */
exports.insert = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {        
        /** VALIDA SE TODOS OS DADOS NECESSÁRIOS FORAM ENVIADOS EM PARAMS */
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])
        /** VALIDA SE O EVENT ENVIADO É UM DOS DISPONÍVEIS ('ALL', 'ROUTE') */
        const verifyIfEventExists = await webhookHelper.verifyIfEventExists(request.body.event)
        /** VALIDA SE TODOS OS DADOS NECESSÁRIOS FORAM ENVIADOS NO PAYLOAD */
        const verifyRequestBodyData = helper.verifyRequestData(request.body, ["event", "method", "url"])
        /** VERIFICA SE JÁ NÃO EXISTE UMA URL PARA O EVENTO */
        const verifyIfWebhookExists = await webhookHelper.verifyIfWebhookExists({token: request.params.token, event: request.body.event})

        /** RETORNA ERRO CASO HAJA UM PROBLEMA NAS VALIDAÇÕES */
        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), errors: verifyRequestParamsData.errors})
            await helper.insertInDB("subscriberLog", {event: "INSERT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        if(verifyRequestBodyData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), errors: verifyRequestBodyData.errors})
            await helper.insertInDB("subscriberLog", {event: "INSERT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestBodyData.errors})
            return
        }
        
        if(verifyIfEventExists.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyIfEventExists.message})
            await helper.insertInDB("subscriberLog", {event: "INSERT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyIfEventExists.message})
            return
        }

        if(verifyIfWebhookExists.status == 200)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyIfWebhookExists.message})
            await helper.insertInDB("subscriberLog", {event: "INSERT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyIfWebhookExists.message})
            return
        }

        next()
    }
    catch(error)
    {
        /** ENVIA UM LOG PARA O APM DO ELASTIC E RETORNA ERRO */
        app.apm.captureError(error)
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "INSERT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: error})
        return
    }
}

/** MIDDLEWARE DA ROTA ATUALIZAÇÃO DE URL'S DE NOTIFICAÇÃO */
exports.update = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {        
        /** VALIDA SE TODOS OS DADOS NECESSÁRIOS FORAM ENVIADOS NO PAYLOAD */
        const verifyRequestBodyData = helper.verifyRequestData(request.body, ["event"])
        /** VALIDA SE TODOS OS DADOS NECESSÁRIOS FORAM ENVIADOS EM PARAMS */
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])
        /** VERIFICA SE JÁ NÃO EXISTE UMA URL PARA O EVENTO */
        const verifyIfWebhookExists = await webhookHelper.verifyIfWebhookExists({token: request.params.token, event: request.body.event})

        /** RETORNA ERRO CASO HAJA UM PROBLEMA NAS VALIDAÇÕES */
        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), errors: verifyRequestParamsData.errors})
            await helper.insertInDB("subscriberLog", {event: "UPDATE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        if(verifyRequestBodyData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), errors: verifyRequestBodyData.errors})
            await helper.insertInDB("subscriberLog", {event: "UPDATE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestBodyData.errors})
            return
        }

        if(verifyIfWebhookExists.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Webhook not exists"})
            await helper.insertInDB("subscriberLog", {event: "UPDATE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: "Webhook not exists"})
            return
        }

        next()
    }
    catch(error)
    {
        /** ENVIA UM LOG PARA O APM DO ELASTIC E RETORNA ERRO */
        app.apm.captureError(error)
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "UPDATE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: error})
        return
    }
}

/** MIDDLEWARE DA ROTA REMOÇÃO DE URL'S DE NOTIFICAÇÃO */
exports.delete = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {    
        /** VALIDA SE TODOS OS DADOS NECESSÁRIOS FORAM ENVIADOS NO PAYLOAD */
        const verifyRequestBodyData = helper.verifyRequestData(request.body, ["event"])
        /** VALIDA SE TODOS OS DADOS NECESSÁRIOS FORAM ENVIADOS EM PARAMS */
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])
        /** VERIFICA SE JÁ NÃO EXISTE UMA URL PARA O EVENTO */
        const verifyIfWebhookExists = await webhookHelper.verifyIfWebhookExists({token: request.params.token, event: request.body.event})

        /** RETORNA ERRO CASO HAJA UM PROBLEMA NAS VALIDAÇÕES */
        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), errors: verifyRequestParamsData.errors})
            await helper.insertInDB("subscriberLog", {event: "DELETE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        if(verifyRequestBodyData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), errors: verifyRequestBodyData.errors})
            await helper.insertInDB("subscriberLog", {event: "DELETE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestBodyData.errors})
            return
        }

        if(verifyIfWebhookExists.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Webhook not exists"})
            await helper.insertInDB("subscriberLog", {event: "DELETE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: "Webhook not exists"})
            return
        }

        next()
    }
    catch(error)
    {
        /** ENVIA UM LOG PARA O APM DO ELASTIC E RETORNA ERRO */
        app.apm.captureError(error)
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "DELETE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: error})
        return
    }
}