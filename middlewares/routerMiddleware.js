'use strict'

require('dotenv').config()
const helper = require('../helpers/helper')
const routerHelper = require('../helpers/routerHelper')

exports.sendTorouter = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {                
        const verifyRequestData = routerHelper.verifyRequestData(request.body)

        if(verifyRequestData.status == 400) 
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Request params bad formatted", errors: verifyRequestData.message})
            return
        }

        next()
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Cannot possible process the request"})
        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_RECEIVED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), errors: e})
        return
    }
}

exports.selectRoutingProcessLog = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {                
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])
        const verifyRequestBodyData = helper.verifyRequestData(request.body, ["process"])

        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Request params bad formatted", errors: verifyRequestParamsData.errors})
            return
        }

        if(verifyRequestBodyData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Request params bad formatted", errors: verifyRequestBodyData.errors})
            return
        }

        next()
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Cannot possible process the request"})
        return
    }
}