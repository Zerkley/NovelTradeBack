const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: false
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
        required: false
    },
    phoneNumber:{
        type: String,
        required: false
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