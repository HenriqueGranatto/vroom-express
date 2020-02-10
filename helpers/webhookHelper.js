'use strict'

require('dotenv').config()

exports.verifyRequestData = (request) => 
{
    try
    {
        if('subscriber' in request == false)
        {
            return {status: 400, message: "Subscriber not sended"}
        }
        if('url' in request == false)
        {
            return {status: 400, message: "URL not sended"}
        }

        return {status: 200}
    }
    catch(e)
    {
        throw e
    }
}