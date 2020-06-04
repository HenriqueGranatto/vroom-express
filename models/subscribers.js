'use strict'

// IMPORTANDO OS MÓDULOS NECESSÁRIOS
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// CRIANDO O ESQUEMA DOS REGISTROS DE CÓDIGOS DE REFERENCIA A SEREM SALVOS NA COLEÇÃO
const subscribers = new Schema({
    token: 
    {
        type: 'String',
        required: true,
    },

    event:
    {
        type: 'String',
        required: true,
    },

    url:
    {
        type: 'String',
        required: true,
    },

    method:
    {
        type: 'String',
        required: true
    },

    auth:
    {
        type: 'String',
        required: true,   
    },

    
    created:
    {
        type: 'Date',
        default: '9999/01/01',
        required: false
    },

    deleted:
    {
        type: 'Number',
        default: 0,
        required: false,   
    }
});


// EXPORTANDOS O ESQUEMA
module.exports = mongoose.model('Subscribers', subscribers)