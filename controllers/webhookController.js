'use strict'

const helper = require('../helpers/helper')

exports.select = async (request, response) =>
{
    try
    {        
        const result = await helper.selectInDB("subscribers", Object.assign({token: request.params.token}, request.body))
        response.status(200).send({status:200, timeRequest: await helper.timeRequest(), message: result})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: await helper.timeRequest(), error: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "SELECT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e})
        return
    }
}

exports.insert = async (request, response) =>
{
    try
    {        
        await helper.insertInDB("subscribers", {
            token: request.params.token.toString(), 
            event: request.body.event || "all",
            url: request.body.url, 
            method: request.body.method || "POST",
            auth: request.body.auth || null,
            created: (new Date).toLocaleString(),
            deleted: false,
        })

        response.status(200).send({status:200, timeRequest: await helper.timeRequest(), message: "Notification URL saved with success"})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: await helper.timeRequest(), error: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "INSERT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e})
        return
    }
}

exports.update = async (request, response) =>
{
    try
    {        
        await helper.updateInDB("subscribers", { token: request.params.token, event: request.body.event }, request.body)
        await helper.insertInDB("subscriberLog", {event: "UPDATE_SUBSCRIBER", token: request.params.token, date: (new Date).toLocaleString(), request: request.body})
        response.status(200).send({status:200, timeRequest: await helper.timeRequest(), message: "Notification URL updated with success"})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: await helper.timeRequest(), error: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "UPDATE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e})
        return
    }
}

exports.delete = async (request, response) =>
{
    try
    {        
        await helper.deleteInDB("subscribers", { token: request.params.token, event: request.body.event })
        await helper.insertInDB("subscriberLog", {event: "DELETE_SUBSCRIBER", token: request.params.token, date: (new Date).toLocaleString(), request: request.body})

        response.status(200).send({status:200, timeRequest: await helper.timeRequest(), message: "Notification URL deleted with success"})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: await helper.timeRequest(), error: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "DELETE_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e})
        return
    }
}