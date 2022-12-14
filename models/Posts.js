const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Post = new Schema ({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true
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

mongoose.model('posts', Post)