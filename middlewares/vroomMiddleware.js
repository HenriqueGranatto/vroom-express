'use strict'

const helper = require('../helpers/helper')
const vroomHelper = require('../helpers/vroomHelper')

exports.sendToVroom = async (request, response, next) =>
{
    try
    {                
        const verifyRequestData = vroomHelper.verifyRequestData(request.body)

        if(verifyRequestData.status == 400) 
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: verifyRequestData.message})
            return
        }

        next()
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: "Cannot possible process the request"})
        return
    }
}