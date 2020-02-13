'use strict'

const app = require('../app')

exports.timeRequest = () => parseFloat((Date.now() - process.env.REQUEST_START) / 1000).toFixed(2)

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

        if(errors.length > 0)
        {
            return {status: 400, errors: errors}
        }

        return {status: 200, errors: errors}
    }
    catch(e)
    {
        throw e
    }
} 

exports.selectInDB = async (table, filter) =>
{
    const db = await app.database()
    const event = filter.event
    delete filter.event

    if(Object.entries(filter).length != 0)
    {
        return db.get(table).filter(filter).filter(obj => event.indexOf(obj.event) != -1 ).value()
    } 

    return db.get(table).value()
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

exports.deleteInDB = async (table, filter) =>
{
    const db = await app.database()
    return db.get(table).remove(filter).write()
}