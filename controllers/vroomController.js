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
        const vroomCommand = vroomHelper.createVroomCommand(request)
        
        if(typeof vroomCommand != 'string')
        {
            webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), error: vroomCommand.message, request: request.body}})
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
                    webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), error: `It was not possible send to rounting`, request: request.body}})
                    return
                }
                else
                {
                    ssh.exec(`${process.env.VROOM_PATH} ${vroomCommand}`, [], {
                        cwd: '/',
                        onStdout(solution) {    
        
                        },
                        onStderr(error) {
                            webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), error: `It was not possible rounting`, request: request.body}})
                            return
                        },
                    }).then(solution => {
                        webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 200, timeRequest: helper.timeRequest(), solution: JSON.parse(`${solution}`), request: request.body}})
                        return
                    })
                }
            }).catch((error) => {
                webhookHelper.sendToObserver({token: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(), error: `It was not send possible`, request: request.body}})
                return
            })
        })        
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(), error: e.toString(), request: request.body})
        return
    }
}