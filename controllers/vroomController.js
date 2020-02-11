'use strict'

const node_ssh = require('node-ssh')
const helper = require('../helpers/helper')
const vroomHelper = require('../helpers/vroomHelper')
const webhookHelper = require('../helpers/webhookHelper')

exports.sendToVroom = async (request, response) =>
{
    const timeStart = Date.now()

    try
    {                
        const verifyRequestData = vroomHelper.verifyRequestData(request.body)

        if(verifyRequestData.status == 400) 
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: verifyRequestData.message, request: request.body})
            return
        }

        response.status(200).send({status: 200, timeRequest: helper.timeRequest(timeStart), message: "Route in processing"})

        const vroomCommand = vroomHelper.createVroomCommand(request, timeStart)
        
        if(typeof vroomCommand != 'string')
        {
            webhookHelper.sendToObserver({subscriber: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(timeStart), error: vroomCommand.message, request: request.body}})
            return
        }
 
        const solution = ""
        const ssh = new node_ssh()
         
        ssh.connect({
            host: process.env.VROOM_IP,
            port: process.env.VROOM_PORT,
            username: process.env.VROOM_SSH_USER,
            password : process.env.VROOM_SSH_PASSWORD
        })
        .then(function() {
            ssh.execCommand(`cd / && echo '${JSON.stringify(request.body)}' > /vroom/${timeStart}`, { cwd:'/' }).then(function(result) {
                if(result.stderr) 
                {
                    webhookHelper.sendToObserver({subscriber: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(timeStart), error: `It was not possible send to rounting`, request: request.body}})
                    return
                }
                else
                {
                    ssh.exec(`${process.env.VROOM_PATH} ${vroomCommand}`, [], {
                        cwd: '/',
                        onStdout(solution) {    
        
                        },
                        onStderr(error) {
                            webhookHelper.sendToObserver({subscriber: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(timeStart), error: `It was not possible rounting`, request: request.body}})
                            return
                        },
                    }).then(solution => {
                        webhookHelper.sendToObserver({subscriber: request.params.token, event: ["all", "route"], data: {status: 200, timeRequest: helper.timeRequest(timeStart), solution: JSON.parse(`${solution}`), request: request.body}})
                        return
                    })
                }
            }).catch((error) => {
                webhookHelper.sendToObserver({subscriber: request.params.token, event: ["all", "route"], data: {status: 400, timeRequest: helper.timeRequest(timeStart), error: `It was not send possible`, request: request.body}})
                return
            })
        })        
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: e.toString(), request: request.body})
        return
    }
}