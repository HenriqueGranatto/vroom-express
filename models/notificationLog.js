'use strict'

// IMPORTANDO OS MÓDULOS NECESSÁRIOS
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// CRIANDO O ESQUEMA DOS REGISTROS DE CÓDIGOS DE REFERENCIA A SEREM SALVOS NA COLEÇÃO
const code = new Schema({
    publicCode: 
    {
        type: 'String',
        required: true,
    },

    points:
    {
        type: 'Number',
        default: 100,
        required: true,
    },

    rate:
    {
        type: 'Number',
        default: 30,
        required: true,
    },

    expireIn:
    {
        type: 'Date',
        default: '9999/01/01',
        required: false
    },

    amountOfFreeRate:
    {
        type: 'Number',
        default: 0,
        required: true,   
    },

    
    amountOfFreeRatealreadyUsed:
    {
        type: 'Number',
        default: 0,
        required: true,   
    },

    amountOfUse:
    {
        type: 'Number',
        default: 0,
        required: true,   
    },

    alreadyUsed:
    {
        type: 'Number',
        default: 0,
        required: true,  
    }
});


// EXPORTANDOS O ESQUEMA
module.exports = mongoose.model('Code', code)