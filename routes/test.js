var express = require('express');
var router = express.Router();
const TestModel = require('../models/test_model');

/* GET Test */
router.post('/', async function(req, res, next) {
    try {
        const test = await TestModel.create(req.body)
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({message: error.message})
    }    
});

module.exports = router;
