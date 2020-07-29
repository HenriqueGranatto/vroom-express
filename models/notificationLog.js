'use strict'

// IMPORTANDO OS MÓDULOS NECESSÁRIOS
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// CRIANDO O ESQUEMA DOS REGISTROS DE CÓDIGOS DE REFERENCIA A SEREM SALVOS NA COLEÇÃO
const notificationLog = new Schema({
    process: 
    {
        type: 'String',
        required: true,
    },

    event:
    {
        type: 'String',
        required: true,
    },

    token:
    {
        type: 'String',
        required: true,
    },

    date:
    {
        type: 'Date',
        default: '9999/01/01',
        required: false
    },

    data: 
    {
        type: String,
        required: false
    }
});


// EXPORTANDOS O ESQUEMA
module.exports = mongoose.model('NotificationLog', notificationLog)
