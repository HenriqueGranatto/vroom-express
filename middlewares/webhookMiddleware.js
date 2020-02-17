'use strict'

require('dotenv').config()
const helper = require('../helpers/helper')
const webhookHelper = require('../helpers/webhookHelper')

exports.select = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {        
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])

        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestParamsData.errors})
            helper.insertInDB("subscribersLog", {token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        next()
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        helper.insertInDB("subscribersLog", {token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e.toString()})
        return
    }
}

exports.insert = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {        
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])
        const verifyIfEventExists = await webhookHelper.verifyIfEventExists(request.body.event)
        const verifyRequestBodyData = helper.verifyRequestData(request.body, ["event", "method", "url"])
        const verifyIfWebhookExists = await webhookHelper.verifyIfWebhookExists({token: request.params.token, event: request.body.event})

        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestParamsData.errors})
            helper.insertInDB("subscribersLog", {token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        if(verifyRequestBodyData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestBodyData.errors})
            helper.insertInDB("subscribersLog", {token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestBodyData.errors})
            return
        }
        
        if(verifyIfEventExists.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyIfEventExists.message})
            helper.insertInDB("subscribersLog", {token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyIfEventExists.message})
            return
        }

        if(verifyIfWebhookExists.status == 200)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyIfWebhookExists.message})
            helper.insertInDB("subscribersLog", {token: request.params.token, date: (new Date).toLocaleString(), reques: request.body, errors: verifyIfWebhookExists.message})
            return
        }

        next()
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        helper.insertInDB("subscribersLog", {token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e.toString()})
        return
    }
}

exports.update = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {        
        const verifyRequestBodyData = helper.verifyRequestData(request.body, ["event"])
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])
        const verifyIfWebhookExists = await webhookHelper.verifyIfWebhookExists({token: request.params.token, event: request.body.event})


        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestParamsData.errors})
            helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        if(verifyRequestBodyData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestBodyData.errors})
            helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestBodyData.errors})
            return
        }

        if(verifyIfWebhookExists.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Webhook not exists"})
            helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), reques: request.body, errors: "Webhook not exists"})
            return
        }

        next()
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e.toString()})
        return
    }
}

exports.delete = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {        
        const verifyRequestBodyData = helper.verifyRequestData(request.body, ["event"])
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])
        const verifyIfWebhookExists = await webhookHelper.verifyIfWebhookExists({token: request.params.token, event: request.body.event})

        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestParamsData.errors})
            helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        if(verifyRequestBodyData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestBodyData.errors})
            helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestBodyData.errors})
            return
        }

        if(verifyIfWebhookExists.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Webhook not exists"})
            helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), reques: request.body, errors: "Webhook not exists"})
            return
        }

        next()
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e.toString()})
        return
    }
}