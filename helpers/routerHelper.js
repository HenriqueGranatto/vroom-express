'use strict'

require('dotenv').config()

/** VALIDA OS DADOS ENVIADOS NA REQUEST COM BASE EM UM FILTRO DO QUE DEVE SER VALIDADO */
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

        if(!request.metadata)
        {
            return {status: 400, message: "Field metadata is required"}
        }

        return {status: 200}
    }
    catch(error)
    {
        throw error
    }
}

/** MONTA O COMANDO QUE SERÁ EXECUTADO NO VROOM */
exports.createrouterCommand = (request) =>
{
    try
    {
        let routerCommand = `` 

        if(!process.env.VROOM_ROUTER && !process.env.SUBDOMAIN_ADDRESS && !process.env.OSRM_PORT && !process.env.CPU_CORES)
        {
            return {status: 400, message: "Necessary to inform the ROUTER, SUBDOMAIN_ADDRESS, OSRM_PORT and CPU_CORES"}
        }
    
        routerCommand += `-r ${process.env.VROOM_ROUTER} -a car:${process.env.SUBDOMAIN_ADDRESS} -p car:${process.env.OSRM_PORT} -t ${process.env.CPU_CORES}`
    
        // if(!process.env.VROOM_GEOMETRY && process.env.VROOM_OVERRIDE && 'options' in request && 'g' in request.options && request.options.g)
        // {
        //     routerCommand += ' -g ';   
        // }

        routerCommand += ` -g -i ./vroom/${process.env.REQUEST_START} ` 
        
        return routerCommand
    }
    catch(error)
    {
        throw error
    }
}
