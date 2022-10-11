const mongoose = require('mongoose')
const router = require('../routes/admin')
const Schema = mongoose.Schema

const User = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    eAdmin: {
        type: Number,
        default: 0
    }
})

mongoose.model('users', User)