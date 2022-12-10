const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Categorie = new Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    date: {
        type: String,
        default: Date.now()
    },
    date2: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('categories', Categorie)