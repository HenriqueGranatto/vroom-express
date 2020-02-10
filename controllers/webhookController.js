'use strict'

const app = require('../app')
const helper = require('../helpers/helper')
const webhookHelper = require('../helpers/webhookHelper')

exports.insert = async (request, response) =>
{
    const timeStart = Date.now()

    try
    {        
        const verifyRequestData = webhookHelper.verifyRequestData(request.body)

        if(verifyRequestData.status == 400) 
        {
            response.status(400).send({timeRequest: helper.timeRequest(timeStart), message: requestValidate.message, request: request.body})
            return
        }

        const verifyIfWebhookExists = await webhookHelper.verifyIfWebhookExists(request.body)
        
        if(verifyIfWebhookExists.status == 400 )
        {
            response.status(400).send({timeRequest: helper.timeRequest(timeStart), message: verifyIfWebhookExists.message, request: request.body})
            return
        }

        const db = await app.database()

        db.get('subscribers').push({
            subscriber: request.body.subscriber, 
            event: request.body.event || "all",
            method: request.body.method || "POST", 
            url: request.body.url, 
            authentication: request.body.authentication || null,
        }).write()

        response.status(200).send({status:200, timeRequest: helper.timeRequest(timeStart), message: "Webhook URL saved with success", request: request.body})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: e.toString(), request: request.body})
        return
    }
}