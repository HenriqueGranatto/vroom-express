'use strict'

const app = require('../app')

exports.verifyRequestData = (request) => 
{
    try
    {
        if('subscriber' in request == false)
        {
            return {status: 400, message: "Subscriber not sended"}
        }
        if('url' in request == false)
        {
            return {status: 400, message: "URL not sended"}
        }

        return {status: 200}
    }
    catch(e)
    {
        throw e
    }
}

exports.verifyIfWebhookExists = async (webhookData) => 
{
    try
    {
        const db = await app.database()

        const result = db.get('subscribers').find({
            subscriber: webhookData.subscriber, 
            event: webhookData.event,
        }).value()

        if(typeof result == 'object')
        {
            return {status: 400, message: 'There is already a registered webhook for this event'}
        }

        return {status: 200}
    }
    catch(e)
    {
        throw e
    }
}