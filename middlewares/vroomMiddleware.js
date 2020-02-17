'use strict'

require('dotenv').config()
const helper = require('../helpers/helper')
const vroomHelper = require('../helpers/vroomHelper')

exports.sendToVroom = async (request, response, next) =>
{
    process.env.REQUEST_START = Date.now()

    try
    {                
        const verifyRequestData = vroomHelper.verifyRequestData(request.body)

        if(verifyRequestData.status == 400) 
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: verifyRequestData.message})
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