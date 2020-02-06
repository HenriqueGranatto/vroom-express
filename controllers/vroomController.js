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
            response.status(400).send({timeRequest: helper.timeRequest(timeStart), message: requestValidate.message, request: request.body})
        }

        vroomCommand = vroomHelper.createVroomCommand(request, timeStart)
        
        if(typeof vroomCommand != 'string')
        {
            response.status(400).send({timeRequest: helper.timeRequest(timeStart), message: vroomCommand.message, request: request.body})
        }
 
        const ssh = new node_ssh()
         
        ssh.connect({
            host: process.env.VROOM_IP,
            port: process.env.VROOM_PORT,
            username: process.env.VROOM_SSH_USER,
            password : process.env.VROOM_SSH_PASSWORD
        })
        .then(function() {
            ssh.execCommand(`cd / && echo '${request.body}' > /vroom/${timeStart}`, { cwd:'/' }).then(function(result) {
                if(result.stderr) throw result.stderr
            })

            ssh.exec(`${process.env.VROOM_PATH}`, [`${vroomCommand}`], {
                cwd: '/',
                onStdout(response) {
                    console.log(response.toString('utf8'))
                },
                onStderr(error) {
                    throw error
                },
            })
        }) 
    }
    catch(e)
    {
        response.status(400).send({timeRequest: helper.timeRequest(timeStart), error: e.toString(), request: request.body})
    }
}