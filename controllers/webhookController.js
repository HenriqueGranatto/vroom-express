'use strict'

const helper = require('../helpers/helper')

exports.select = async (request, response) =>
{
    try
    {        
        const result = await helper.selectInDB("subscribers", {token: request.params.token})
        response.status(200).send({status:200, timeRequest: helper.timeRequest(), message: result})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e.toString()})
        return
    }
}

exports.insert = async (request, response) =>
{
    try
    {        
        helper.insertInDB("subscribers", {
            token: request.params.token.toString(), 
            event: request.body.event || "all",
            method: request.body.method || "POST", 
            url: request.body.url, 
            created: (new Date).toLocaleString(),
            deleted: false,
        })

        response.status(200).send({status:200, timeRequest: helper.timeRequest(), message: "Notification URL saved with success"})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e.toString()})
        return
    }
}

exports.update = async (request, response) =>
{
    try
    {        
        helper.updateInDB("subscribers", { token: request.params.token, event: request.body.event }, {
            method: request.body.method || "POST", 
            event: request.body.event || "POST", 
            url: request.body.url, 
        })

        helper.insertInDB("subscribersLog", {event: "update", token: request.params.token, date: (new Date).toLocaleString(), request: request.body})
        response.status(200).send({status:200, timeRequest: helper.timeRequest(), message: "Notification URL updated with success"})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e.toString()})
        return
    }
}

exports.delete = async (request, response) =>
{
    try
    {        
        helper.deleteInDB("subscribers", { subscriber: request.body.subscriber, event: request.body.event })
        helper.insertInDB("subscribersLog", {event: "delete", subscriber: request.body.subscriber, date: (new Date).toLocaleString(), request: request.body})

        response.status(200).send({status:200, timeRequest: helper.timeRequest(), message: "Notification URL deleted with success"})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e.toString()})
        return
    }
}