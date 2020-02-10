'use strict'

const node_ssh = require('node-ssh')
const helper = require('../helpers/helper')
const vroomHelper = require('../helpers/vroomHelper')

exports.sendToVroom = async (request, response) =>
{
    try
    {        
        let vroomCommand = ''
        let timeStart = Date.now()
        
        const requestValidate = vroomHelper.verifyRequestData(request.body)

        if(requestValidate.status == 400) 
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: requestValidate.message, request: request.body})
            return
        }

        vroomCommand = vroomHelper.createVroomCommand(request, timeStart)
        
        if(typeof vroomCommand != 'string')
        {
            response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: vroomCommand.message, request: request.body})
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
            ssh.execCommand(`cd / && echo '${JSON.stringify(request.body)}' > /vroom/${timeStart}`, { cwd:'/' }).then(function(result) {
                if(result.stderr) 
                {
                    response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: `${result.stderr}`, request: request.body})
                    return
                }
            })

            ssh.exec(`${process.env.VROOM_PATH} ${vroomCommand}`, [], {
                cwd: '/',
                onStdout(solution) {
                    response.status(200).send({timeRequest: helper.timeRequest(timeStart), solution: JSON.parse(`${solution}`), request: request.body})
                    return
                },
                onStderr(error) {
                    response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: `${result.stderr}`, request: request.body})
                    return
                },
            })
        }) 
    }
    catch(e)
    {
        response.status(400).send({status: 400, timeRequest: helper.timeRequest(timeStart), error: e.toString(), request: request.body})
        return
    }
}