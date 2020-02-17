'use strict'

require('dotenv').config()
const axios = require('axios').default
const helper = require('../helpers/helper')

const eventList = ["all", "route"]

exports.verifyIfWebhookExists = async (webhookData) => 
{
    try
    {
        const result = await helper.selectInDB("subscribers", webhookData)

        if(typeof result == 'object' && result.length > 0)
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

exports.sendToObserver = async (settingsToRequest) =>
{
    try
    {
        const config = await helper.selectInDB("subscribers", {token: settingsToRequest.token, event: settingsToRequest.event})

        config.map((obj) => {
            const request =  { method: obj.method, url: obj.url, data: settingsToRequest.data }
        
            if(request.data.dataLink)
            {
                let dataLink = request.data.dataLink
                delete request.data.dataLink

                axios(request)

                request.data.data = dataLink
                helper.insertInDB("notificationLog", {process: process.env.REQUEST_START, event: "NOTIFICATION_SENDED", token: settingsToRequest.token, date: (new Date).toLocaleString(), data: request})
            }
            else
            {
                axios(request)
                helper.insertInDB("notificationLog", {process: process.env.REQUEST_START, event: "NOTIFICATION_SENDED", token: settingsToRequest.token, date: (new Date).toLocaleString(), data: request})
            }
        })
    }
    catch(e)
    {
        helper.insertInDB("notificationLog", {process: process.env.REQUEST_START, event: "NOTIFICATION_SENDED_ERROR", token: settingsToRequest.token, date: (new Date).toLocaleString(), data: e})
        throw e
    }
}