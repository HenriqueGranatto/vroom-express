'use strict'

const {db} = require('../app')
const webhookHelper = require('../helpers/webhookHelper')

exports.insert = async (request, response) =>
{
    try
    {        
        const timeStart = Date.now()
        const requestValidate = webhookHelper.verifyRequestData(request.body)

        if(requestValidate.status == 400) 
        {
            response.status(400).send({timeRequest: helper.timeRequest(timeStart), message: requestValidate.message, request: request.body})
        }

        db.push("/subscribers", {
            subscriber: request.body.subscriber, 
            event: request.body.event || "all",
            method: request.body.method || "POST", 
            url: request.body.url, 
            authentication: request.token || null,
        })

        console.log(db)

        response.status(200).send({status:200, timeRequest: helper.timeRequest(timeStart), message: "Webhook URL saved with success", request: request.body})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: e.toString(), request: request.body})
    }
}