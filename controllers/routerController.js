'use strict'

require('dotenv').config()
const app = require('../app')
const node_ssh = require('node-ssh')
const helper = require('../helpers/helper')
const routerHelper = require('../helpers/routerHelper')
const webhookHelper = require('../helpers/webhookHelper')

exports.sendToRouter = async (request, response) =>
{
    try
    {  
        response.status(200).send({status: 200, timeRequest: helper.timeRequest(), message: "Routing in processing", data: {process: process.env.REQUEST_START}})
        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_RECEIVED", token: request.params.token, date: (new Date).toLocaleString()})

        const routerCommand = routerHelper.createrouterCommand(request)
        
        if(typeof routerCommand != 'string')
        {
            webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: routerCommand.message}})
            helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_ROUTED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), data: `${routerCommand.message}`})
            return
        }
 
        const ssh = new node_ssh()
         
        ssh.connect({
            host: process.env.SUBDOMAIN_ADDRESS,
            port: process.env.VROOM_PORT,
            username: process.env.VROOM_SSH_USER,
            password : process.env.VROOM_SSH_PASSWORD
        })
        .then(function() {
            ssh.execCommand(`cd / && echo '${JSON.stringify(request.body)}' > /vroom/${process.env.REQUEST_START}`, { cwd:'/' }).then(function(result) {
                if(result.stderr) 
                {
                    webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: 'It was not possible send problem to rounting'}})
                    helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), data: `${result.stderr}`})
                    return
                }
                else
                {
                    helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED", token: request.params.token, date: (new Date).toLocaleString() })

                    ssh.exec(`${process.env.VROOM_PATH} ${routerCommand}`, [], {
                        cwd: '/',
                        onStderr(error) {
                            webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: `It was not possible rounting`}})
                            helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_ROUTED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), data: error.message})
                            return
                        },
                    }).then(solution => {
                        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_ROUTED", token: request.params.token, date: (new Date).toLocaleString() })
                        helper.saveInS3(JSON.stringify(JSON.parse(`${solution}`)), (error, data) => {
                            if(error)
                            {
                                webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 200, timeRequest: helper.timeRequest(), message: `It was not possible send solution`}})
                                helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "SOLUTION_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), data: error.message})
                                return
                            }
                            else
                            {
                                webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 200, timeRequest: helper.timeRequest(), message: `Problem successfully routed`, metadata: request.body.metadata, data: JSON.stringify(JSON.parse(`${solution}`)), dataLink: data.Location}})
                                helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "SOLUTION_SENDED", token: request.params.token, date: (new Date).toLocaleString(), data: data.Location})
                                return
                            }
                        })

                        return
                    }).catch((error) => {
                        webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: `It was not possible send solution`}})
                        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "SOLUTION_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), data: error.message})
                        return
                    })
                }
            }).catch((error) => {
                webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: 'It was not possible send problem to rounting'}})
                helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), errors: data.message})
                return
            })
        })    
        .catch((error) => {
            webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), message: 'It was not possible send problem to rounting'}})
            helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), errors: data.message})
            return
        })    
    }
    catch(error)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: `Cannot possible process the request`})
        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_RECEIVED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), errors: error.message})
        return
    }
}

exports.sendToRouterSync = async (request, response) =>
{
    try
    {  
        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_RECEIVED", token: request.params.token, date: (new Date).toLocaleString()})

        const routerCommand = routerHelper.createrouterCommand(request)
        
        if(typeof routerCommand != 'string')
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: routerCommand.message})
            helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_ROUTED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), data: `${routerCommand.message}`})
            return
        }
 
        const ssh = new node_ssh()
         
        ssh.connect({
            host: process.env.SUBDOMAIN_ADDRESS,
            port: process.env.VROOM_PORT,
            username: process.env.VROOM_SSH_USER,
            password : process.env.VROOM_SSH_PASSWORD
        })
        .then(function() {
            ssh.execCommand(`cd / && echo '${JSON.stringify(request.body)}' > /vroom/${process.env.REQUEST_START}`, { cwd:'/' }).then(function(result) {
                if(result.stderr) 
                {
                    response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: 'It was not possible send problem to rounting'})
                    helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), data: `${result.stderr}`})
                    return
                }
                else
                {
                    helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED", token: request.params.token, date: (new Date).toLocaleString() })

                    ssh.exec(`${process.env.VROOM_PATH} ${routerCommand}`, [], {
                        cwd: '/',
                        onStderr(error) {
                            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: `It was not possible rounting`})
                            helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_ROUTED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), data: error.message})
                            return
                        },
                    }).then(solution => {
                        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_ROUTED", token: request.params.token, date: (new Date).toLocaleString() })
                        helper.saveInS3(JSON.stringify(JSON.parse(`${solution}`)), (error, data) => {
                            if(error)
                            {
                                response.status(200).send({status: 200, timeRequest: helper.timeRequest(), message: `It was not possible send solution`})
                                helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "SOLUTION_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), data: error.message})
                                return
                            }
                            else
                            {
                                response.status(200).send({status: 200, timeRequest: helper.timeRequest(), message: `Problem successfully routed`, metadata: request.body.metadata, data: JSON.stringify(JSON.parse(`${solution}`)), dataLink: data.Location})
                                helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "SOLUTION_SENDED", token: request.params.token, date: (new Date).toLocaleString(), data: data.Location})
                                return
                            }
                        })

                        return
                    }).catch((error) => {
                        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: `It was not possible send solution`})
                        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "SOLUTION_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), data: error.message})
                        return
                    })
                }
            }).catch((error) => {
                response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: 'It was not possible send problem to rounting'})
                helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), errors: data.message})
                return
            })
        })    
        .catch((error) => {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(), message: 'It was not possible send problem to rounting'})
            helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_SENDED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), errors: data.message})
            return
        })    
    }
    catch(error)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: `Cannot possible process the request`})
        helper.insertInDB("routeLog", {process: process.env.REQUEST_START, event: "PROBLEM_RECEIVED_ERROR", token: request.params.token, date: (new Date).toLocaleString(), errors: error.message})
        return
    }
}

exports.selectRoutingProcessLog = async (request, response) =>
{
    try
    {        
        const routeLog = await helper.selectInDB("routeLog", Object.assign({token: request.params.token}, request.body))
        const notificationLog = await helper.selectInDB("notificationLog", Object.assign({token: request.params.token}, request.body))

        response.status(200).send({status:200, timeRequest: await helper.timeRequest(), data: {routeLog, notificationLog}})
    }
    catch(error)
    {
        response.status(400).send({status: 400, timeRequest: await helper.timeRequest(), error: "Cannot possible process the request"})
        await helper.insertInDB("subscriberLog", {event: "SELECT_SUBSCRIBER_ERROR", token: request.params.token, date: (new Date).toLocaleString(), request: request.body, errors: error})
        return
    }
}
