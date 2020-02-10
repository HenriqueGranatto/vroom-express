'use strict'

const app = require('../app')

exports.timeRequest = (timeStart) => parseFloat((Date.now() - timeStart) / 1000).toFixed(2)

exports.verifyRequestData = (request, filters) => 
{
    try
    {
        let errors = []

        filters.map((obj) => {
            if(obj in request == false)
            {
                errors.push({message: `${obj} not sended`})
            }
        })

        if(errors.length > 0) return {status: 400, errors: errors}

        return {status: 200}
    }
    catch(e)
    {
        throw e
    }
}

exports.insertInDB = async (table, data) =>
{
    const db = await app.database()
    return db.get(table).push(data).write()
}

exports.updateInDB = async (table, filter, data) =>
{
    const db = await app.database()
    return db.get(table).find(filter).assign(data).write()
}