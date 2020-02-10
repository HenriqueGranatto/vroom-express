'use strict'

const app = require('../app')

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
            return {status: 200, message: 'There is already a registered webhook for this event'}
        }

        return {status: 400}
    }
    catch(e)
    {
        throw e
    }
}