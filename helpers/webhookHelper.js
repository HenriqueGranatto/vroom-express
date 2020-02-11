'use strict'

const app = require('../app')
const axios = require('axios').default
const helper = require('../helpers/helper')

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

exports.sendToObserver = async (request) =>
{
    const config = await helper.selectInDB("subscribers", {subscriber: request.subscriber, event: request.event})

    axios({
        method: config.method,
        url: config.url,
        data: request.data
    })
}