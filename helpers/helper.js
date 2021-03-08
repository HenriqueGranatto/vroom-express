'use strict'

// IMPORTANDO OS MÓDULOS NECESSÁRIOS
require('dotenv').config()
const app = require('../app')
const AWS = require('aws-sdk')
const mongoose = require('mongoose')

/** CALCULA O TEMPO DE RESPOSTA DA REQUEST */
exports.timeRequest = () => parseFloat((Date.now() - process.env.REQUEST_START) / 1000).toFixed(2)

/** VALIDA OS DADOS ENVIADOS NA REQUEST COM BASE EM UM FILTRO DO QUE DEVE SER VALIDADO */
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
    catch(error)
    {
        throw error
    }
} 

/** SALVA ALGUM ARQUIVO NO S3 */
exports.saveInS3 = async (file, callback) =>
{   
    try 
    {
        AWS.config.update({region: 'sa-east-1', credentials: {accessKeyId: `${process.env.AWS_S3_ACCESS_KEY}`, secretAccessKey: `${process.env.AWS_S3_SECRET_KEY}`}})
        const S3 = new AWS.S3({apiVersion: '2006-03-01'})
        const uploadParams = {Bucket: `gohusky`, Key: `${process.env.REQUEST_START}`, Body: file}
    
        S3.upload(uploadParams, (error, data) => callback(error, data))   
    } 
    catch (error) 
    {
    }
}

/** BUSCA ALGUMA INFORMAÇÃO NO BANCO DE DADOS */
exports.selectInDB = async (model, filter) =>
{
    try 
    {
        const db = mongoose.model(`${model[0].toUpperCase()}${model.slice(1)}`)

        if(Object.entries(filter).length == 0){ return db.find({}) }
        if(Object.entries(filter).length == 1){ return db.find({token: filter.token}) }
    
        let response = []
        let data = await db.find(filter)
    
        filter = Object.entries(filter)
    
        data.map((data) => {
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
    catch (error) 
    {
    }
}

/** INSERE ALGUMA INFORMAÇÃO NO BANCO DE DADOS */
exports.insertInDB = async (table, data) =>
{
    try 
    {
        table = `${table[0].toUpperCase()}${table.slice(1)}`
        let db = mongoose.model(table)
        db = new db(data)
        await db.save()   
    } 
    catch (error) 
    {
    }
}

/** ATUALIZA ALGUMA INFORMAÇÃO NO BANCO DE DADOS */
exports.updateInDB = async (model, filter, data) =>
{
    try 
    {
        model = `${model[0].toUpperCase()}${model.slice(1)}`
        let db = mongoose.model(model)
        let register = await db.findOne(filter)
        Object.assign(register, data)
        register.save()   
    } 
    catch (error) 
    {
    }
}

/** DELETA ALGUMA INFORMAÇÃO NO BANCO DE DADOS */
exports.deleteInDB = async (model, filter) =>
{
    try 
    {
        model = `${model[0].toUpperCase()}${model.slice(1)}`
        let db = mongoose.model(model)
        let register = await db.findOne(filter)
        register.deleteOne({ _id: register._id })   
    } 
    catch (error) 
    {
    }
}