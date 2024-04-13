const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    bookOne:{
        type: Object,
        required: false
    },
    bookTwo:{
        type: Object,
        required: false
    },
    OwnerOneOk:{
        type: Boolean,
        required: false
    },
    OwnerTwoOk:{
        type: Boolean,
        required: false
    },
});

const OfferModel = mongoose.model('Offer', OfferSchema);
module.exports = OfferModel;