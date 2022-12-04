const mongoose = require('mongoose')
const Schema = mongoose.Schema;

function todayDate() {
    const today = new Date(Date.now())
    day = today.getDate()
    if(day < 10) {
        day = ("0"+day)
    }
    month = today.getMonth()+1
    if(month < 10) {
        month = ("0"+month)
    }
    year = today.getFullYear()
    hours = today.getHours()
    if(hours < 10) {
        hours = ("0"+hours)
    }
    minutes = today.getMinutes()
    return dateNow = (day+"/"+month+"/"+year+" - "+hours+":"+minutes)
}

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
        type: Date,
        default: Date.now()
    }
})

mongoose.model('posts', Post)