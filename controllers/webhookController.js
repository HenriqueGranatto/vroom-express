'use strict'

const helper = require('../helpers/helper')

exports.select = async (request, response) =>
{
    try
    {        
        const result = await helper.selectInDB("subscribers", Object.assign({token: request.params.token}, request.body))
        response.status(200).send({status:200, timeRequest: helper.timeRequest(), message: result})
    }
    catch(e)
    {
        console.log(e)
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
            url: request.body.url, 
            method: request.body.method || "POST",
            auth: request.body.auth.toString() || null,
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
        let event = request.body.event
        delete request.body.event
        helper.updateInDB("subscribers", { token: request.params.token, event: event }, request.body)
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
        helper.deleteInDB("subscribers", { token: request.params.token, event: request.body.event })
        helper.insertInDB("subscribersLog", {event: "delete", token: request.params.token, date: (new Date).toLocaleString(), request: request.body})

        response.status(200).send({status:200, timeRequest: helper.timeRequest(), message: "Notification URL deleted with success"})
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        helper.insertInDB("subscribersLog", {event: "error", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: e.toString()})
        return
    }
}