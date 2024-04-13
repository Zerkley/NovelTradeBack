const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
    });

    const TestModel = mongoose.model('Test', TestSchema);
    module.exports = TestModel;
