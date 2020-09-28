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
    catch(error)
    {
        app.apm.captureError(error)
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Cannot possible process the request"})
        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_RECEIVED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), errors: error})
        return
    }
}

exports.selectRoutingProcessLog = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {                
        const verifyRequestParamsData = helper.verifyRequestData(request.params, ["token"])

        if(verifyRequestParamsData.status == 400)
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Request params bad formatted", errors: verifyRequestParamsData.errors})
            return
        }

        next()
    }
    catch(error)
    {
        app.apm.captureError(error)
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: "Cannot possible process the request"})
        return
    }
}