'use strict'

require('dotenv').config()
const node_ssh = require('node-ssh')
const helper = require('../helpers/helper')
const vroomHelper = require('../helpers/vroomHelper')
const webhookHelper = require('../helpers/webhookHelper')

exports.sendToVroom = async (request, response) =>
{
    try
    {  
        response.status(200).send({status: 200, timeRequest: helper.timeRequest(), message: "Routing in processing"})
        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_RECEIVED", token: request.params.token, date: (new Date).toLocaleString()})

        const vroomCommand = vroomHelper.createVroomCommand(request)
        
        if(typeof vroomCommand != 'string')
        {
            webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: vroomCommand.message}})
            helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_ROUTED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), message: `It was not possible rounting`, errors: vroomCommand.message})
            return
        }
 
        const ssh = new node_ssh()
         
        ssh.connect({
            host: process.env.VROOM_IP,
            port: process.env.VROOM_PORT,
            username: process.env.VROOM_SSH_USER,
            password : process.env.VROOM_SSH_PASSWORD
        })
        .then(function() {
            ssh.execCommand(`cd / && echo '${JSON.stringify(request.body)}' > /vroom/${process.env.REQUEST_START}`, { cwd:'/' }).then(function(result) {
                if(result.stderr) 
                {
                    webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: `It was not possible send problem to rounting`}})
                    helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), message: `It was not possible send problem to rounting`, errors: result.stderr})
                    return
                }
                else
                {
                    helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED", token: request.params.token, date: (new Date).toLocaleString() })

                    ssh.exec(`${process.env.VROOM_PATH} ${vroomCommand}`, [], {
                        cwd: '/',
                        onStderr(error) {
                            webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: `It was not possible rounting`}})
                            helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_ROUTED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), message: `It was not possible rounting`, errors: error})
                            return
                        },
                    }).then(solution => {
                        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_ROUTED", token: request.params.token, date: (new Date).toLocaleString() })
                        helper.saveInS3(JSON.stringify(JSON.parse(`${solution}`)), (error, data) => {
                            if(error)
                            {
                                webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 200, timeRequest: helper.timeRequest(), message: `It was not possible send solution`}})
                                helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "SOLUTION_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), message: `It was not possible send solution`, errors, error})
                            }
                            else
                            {
                                webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 200, timeRequest: helper.timeRequest(), message: `Problem successfully routed`, data: JSON.stringify(JSON.parse(`${solution}`))}})
                                helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "SOLUTION_SENDED", token: request.params.token, date: (new Date).toLocaleString(), data: data.Location})
                            }
                        })

                        return
                    }).catch((error) => {
                        webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: `It was not possible send solution`}})
                        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "SOLUTION_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), message: `It was not possible send solution`, errors: error})
                        return
                    })
                }
            }).catch((error) => {
                webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: `It was not possible send problem to rounting`}})
                helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), message: `It was not possible send problem to rounting`, errors: error})
                return
            })
        })    
        .catch((error) => {
            webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: `It was not possible send problem to rounting`}})
            helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "error", token: request.params.token, date: (new Date).toLocaleString(), message: `It was not possible send problem to rounting`, errors: error})
            return
        })    
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: `Cannot possible process the request`})
        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_RECEIVED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), message: e.toString()})
        return
    }
}