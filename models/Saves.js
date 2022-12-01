const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Save = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
})

mongoose.model('saves', Save)