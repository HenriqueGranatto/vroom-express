'use strict'

require('dotenv').config()

exports.verifyRequestData = (request) => 
{
    try
    {
        if('jobs' in request == false && 'vehicles' in request == false)
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

        return {status: 200}
    }
    catch(e)
    {
        throw e
    }
}

exports.createVroomCommand = (request, filename) =>
{
    try
    {
        let vroomCommand = `` 

        if(!process.env.VROOM_ROUTER && !process.env.OSRM_IP && !process.env.OSRM_PORT && !process.env.CPU_CORES)
        {
            return {status: 400, message: "Necessary to inform the ROUTER, OSRM_IP, OSRM_PORT and CPU_CORES"}
        }
    
        vroomCommand += `-r ${process.env.VROOM_ROUTER} -a car:${process.env.OSRM_IP} -p car:${process.env.OSRM_PORT} -t ${process.env.CPU_CORES}`
    
        if(!process.env.VROOM_GEOMETRY && process.env.VROOM_OVERRIDE && 'options' in request && 'g' in request.options && request.options.g)
        {
            vroomCommand += ' -g ';   
        }

        vroomCommand += ` -i ./vroom/${filename} ` 
        
        return vroomCommand
    }
    catch(e)
    {
        throw e
    }
}