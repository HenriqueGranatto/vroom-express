'use strict'

const { spawn } = require('child_process')
const helper = require('../helpers/helper')
const vroomHelper = require('../helpers/vroomHelper')

exports.sendToVroom = async (request, response) =>
{
    try
    {        
        const vroom = null
        let solution = '';
        let vroomCommand = ''
        let timeStart = Date.now()
        
        const requestValidate = vroomHelper.verifyRequestData(request.body)

        if(requestValidate.status == 400) 
        {
            response.status(400).send({timeRequest: helper.timeRequest(timeStart), message: requestValidate.message, request: request.body})
        }

        vroomCommand = vroomHelper.createVroomCommand(request, filename)
        
        if(typeof vroomCommand != 'string')
        {
            response.status(400).send({timeRequest: helper.timeRequest(timeStart), message: vroomCommand.message, request: request.body})
        }
        
        vroom = spawn(vroomHelper.createVroomCommand(request));
        
        vroom.on('error', error => {
            response.status(400).send({timeRequest: helper.timeRequest(timeStart), message: error, request: request.body})
        });
                
        vroom.stdout.on('data', data => {
            solution += data.toString();
        });
        
        vroom.on('close', (code, signal) => {
            response.status(200).send({status: code, routeTime: helper.timeRequest(timeStart), solution: solution, message: signal})
        })    
    }
    catch(e)
    {
        response.status(400).send({error: e, request: request})
    }
}