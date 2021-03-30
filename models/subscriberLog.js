'use strict'

// IMPORTANDO OS MÓDULOS NECESSÁRIOS
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// CRIANDO O ESQUEMA DOS REGISTROS DE CÓDIGOS DE REFERENCIA A SEREM SALVOS NA COLEÇÃO
const subscriberLog = new Schema({
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
        type: 'String',
        required: false
    },

    request:
    {
        type: 'String',
        required: true,
    },

    error:
    {
        type: 'String',
        required: false,
    }
});


// EXPORTANDOS O ESQUEMA
module.exports = mongoose.model('SubscriberLog', subscriberLog)