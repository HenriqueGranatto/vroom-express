'use strict'

const app = require('../app')
const axios = require('axios').default
const helper = require('../helpers/helper')

const eventList = ["all", "route"]

exports.verifyIfWebhookExists = async (webhookData) => 
{
    try
    {
        const db = await app.database()

        const result = db.get('subscribers').find({
            token: webhookData.token, 
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

exports.verifyIfEventExists = (event) =>
{
    try
    {
        if(eventList.indexOf(event) == -1 && event != "all")
        {
            return {status: 400, message: "Event type not allowed"}
        }
        
        return {status: 200}
    }
    catch(e)
    {
        throw e
    }
}

exports.sendToObserver = async (request) =>
{
    try
    {
        const config = await helper.selectInDB("subscribers", {subscriber: request.subscriber, event: request.event})

        config.map((obj) => {
            axios({
                method: obj.method,
                url:    obj.url,
                data:   request.data
            })
        })
    }
    catch(e)
    {
        throw e
    }
}