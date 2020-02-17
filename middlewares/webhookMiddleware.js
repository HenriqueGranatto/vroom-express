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
            await helper.insertInDB("subscriberLog", {event: "SELECT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        next()
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "SELECT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e})
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
            await helper.insertInDB("subscriberLog", {event: "INSERT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        if(verifyRequestBodyData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestBodyData.errors})
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
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "INSERT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e})
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
            await helper.insertInDB("subscriberLog", {event: "UPDATE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        if(verifyRequestBodyData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestBodyData.errors})
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
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "UPDATE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e})
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
            await helper.insertInDB("subscriberLog", {event: "DELETE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: verifyRequestParamsData.errors})
            return
        }

        if(verifyRequestBodyData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestBodyData.errors})
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
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "DELETE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e})
        return
    }
}