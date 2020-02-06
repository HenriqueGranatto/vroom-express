'use strict'

require('dotenv').config()

exports.verifyRequestData = (request) => 
{
    if(!'jobs' in request && !'vehicles' in request)
    {
        return {status: 400, message: "Jobs or Vehicles not sended"}
    }

    if(request.jobs.length > process.env.MAX_JOBS)
    {
        return {status: 400, message: "More Jobs than allowed"}
    }

    if(request.jobs.length > process.env.MAX_VEHICLES)
    {
        return {status: 400, message: "More Vehicles than allowed"}
    }
}

exports.createVroomCommand = (request, filename) =>
{
    let vroomCommand = `-i ${filename}` 

    if(!process.env.ROUTER && !process.env.OSRM_IP && !process.env.OSRM_PORT && !process.env.CPU_CORES)
    {
        return {status: 400, message: "Necessary to inform the ROUTER, OSRM_IP, OSRM_PORT and CPU_CORES"}
    }

    vroomCommand += `-r ${!process.env.ROUTER} -a car:${process.env.OSRM_IP} -p car:${process.env.OSRM_PORT} -t ${process.env.CPU_CORES}`

    if(!process.env.GEOMETRY && process.env.OVERRIDE && 'options' in request && 'g' in request.options && request.options.g)
    {
        vroomCommand += ' -g ';   
    }
    
    return vroomCommand
}