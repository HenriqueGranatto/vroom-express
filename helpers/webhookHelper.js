'use strict'

// IMPORTANDO OS MÓDULOS NECESSÁRIOS
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
    catch(error)
    {
        throw error
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
    catch(error)
    {
        throw error
    }
}

exports.sendToObserver = async (settingsToRequest) =>
{
    try
    {
        const config = await helper.selectInDB("subscribers", {token: settingsToRequest.token, event: settingsToRequest.event})

        config.map((obj) => {
            settingsToRequest.data.auth = obj.auth

            const request =  { method: obj.method, url: obj.url, data: settingsToRequest.data }
        
            if(request.data.dataLink)
            {
                axios(request).then(() => {
                    delete request.data.data
                    helper.insertInDB("notificationLog", {process: process.env.REQUEST_START, event: "NOTIFICATION_SENDED", token: settingsToRequest.token, date: (new Date).toLocaleString(), data: request})
                }).catch((error) => {
                })
            }
            else
            {
                axios(request).then(() => {
                    helper.insertInDB("notificationLog", {process: process.env.REQUEST_START, event: "NOTIFICATION_SENDED", token: settingsToRequest.token, date: (new Date).toLocaleString(), data: request})
                }).catch((error) => {
                })
            }
        })
    }
    catch(error)
    {
        helper.insertInDB("notificationLog", {process: process.env.REQUEST_START, event: "NOTIFICATION_SENDED_ERROR", token: settingsToRequest.token, date: (new Date).toLocaleString(), error: error})
        throw error
    }
}
