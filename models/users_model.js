const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true
    },
    profilePicture:{
        type: String,
        required: false
    },
    books:{
        type: mongoose.Types.ObjectId,
        ref: 'Book'
    },
    offers:{
        type: mongoose.Types.ObjectId,
        ref: 'Offer'
    },
});



const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;