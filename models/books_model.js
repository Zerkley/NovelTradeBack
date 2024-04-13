const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    publishedYear:{
        type: Number,
        required: true
    },
    genre:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    size:{
        type: String,
        required: true
    },
    picture:{
        type: String,
        required: false
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
});
const BookModel = mongoose.model('Book', BookSchema);

module.exports = BookModel;