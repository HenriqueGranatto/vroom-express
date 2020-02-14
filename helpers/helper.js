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

    if(Object.entries(filter).length == 0){ return db.get(table).value() }
    if(Object.entries(filter).length == 1){ return db.get(table).filter({token: filter.token}).value() }

    let response = []
    let token = filter.token

    delete filter.token
    filter = Object.entries(filter)
    table = db.get(table).filter({token: token}).value()

    table.map((data) => {
        let dataMatch = false

        filter.map((attribute) => {
            if(Array.isArray(attribute[1]) == true)
            {
                dataMatch = (attribute[1].indexOf(data[attribute[0]]) > -1) ? true : false
            }
            else
            {
                dataMatch = (data[attribute[0]] == attribute[1]) ? true : false
            }
        })

        if(dataMatch == true) { response.push(data) }
    })

    return response
}

exports.insertInDB = async (table, data) =>
{
    const db = await app.database()
    db.get(table).push(data).write()
}

exports.updateInDB = async (table, filter, data) =>
{
    const db = await app.database()
    db.get(table).find(filter).assign(data).write()
}

exports.deleteInDB = async (table, filter) =>
{
    const db = await app.database()
    db.get(table).remove(filter).write()
}