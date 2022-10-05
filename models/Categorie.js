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
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('categories', Categorie)