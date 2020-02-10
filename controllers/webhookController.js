'use strict'

const helper = require('../helpers/helper')
const webhookHelper = require('../helpers/webhookHelper')

exports.insert = async (request, response) =>
{
    const timeStart = Date.now()

    try
    {        
        const verifyRequestData = helper.verifyRequestData(request.body, ["subscriber", "url"])

        if(verifyRequestData.status == 400) 
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: verifyRequestData.errors, request: request.body})
            return
        }

        const verifyIfWebhookExists = await webhookHelper.verifyIfWebhookExists(request.body)
        
        if(verifyIfWebhookExists.status == 200 )
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), message: verifyIfWebhookExists.message, request: request.body})
            return
        }

        helper.insertInDB("subscribers", {
            subscriber: request.body.subscriber, 
            event: request.body.event || "all",
            method: request.body.method || "POST", 
            url: request.body.url, 
            authentication: request.body.authentication || null,
            created: (new Date).toLocaleString(),
            activated: true,
        })

        response.status(200).send({status:200, timeRequest: helper.timeRequest(timeStart), message: "Webhook URL saved with success", request: request.body})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: e.toString(), request: request.body})
        return
    }
}

exports.update = async (request, response) =>
{
    const timeStart = Date.now()

    try
    {        
        const verifyRequestData = helper.verifyRequestData(request.body, ["subscriber", "event"])

        if(verifyRequestData.status == 400) 
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), errors: verifyRequestData.errors, request: request.body})
            return
        }

        const verifyIfWebhookExists = await webhookHelper.verifyIfWebhookExists(request.body)
        
        if(verifyIfWebhookExists.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), message: "Webhok URL not exists", request: request.body})
            return
        }

        helper.updateInDB("subscribers", { subscriber: request.body.subscriber, event: request.body.event }, {
            method: request.body.method || "POST", 
            url: request.body.url, 
            authentication: request.body.authentication || null,
            created: (new Date).toLocaleString(),
            activated: true,
        })

        response.status(200).send({status:200, timeRequest: helper.timeRequest(timeStart), message: "Webhook URL updated with success", request: request.body})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: e.toString(), request: request.body})
        return
    }
}

exports.delete = async (request, response) =>
{
    const timeStart = Date.now()

    try
    {        
        const verifyRequestData = helper.verifyRequestData(request.body, ["subscriber", "event"])

        if(verifyRequestData.status == 400) 
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), errors: verifyRequestData.errors, request: request.body})
            return
        }

        const verifyIfWebhookExists = await webhookHelper.verifyIfWebhookExists(request.body)
        
        if(verifyIfWebhookExists.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), message: "Webhok URL not exists", request: request.body})
            return
        }

        helper.deleteInDB("subscribers", { subscriber: request.body.subscriber, event: request.body.event })

        response.status(200).send({status:200, timeRequest: helper.timeRequest(timeStart), message: "Webhook URL updated with success", request: request.body})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: e.toString(), request: request.body})
        return
    }
}