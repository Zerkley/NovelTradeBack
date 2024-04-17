var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const checkToken = require('../services/verification');
const UserModel = require('../models/users_model');
const BookModel = require('../models/books_model');
const OfferModel = require('../models/offers_model');



/**
 * @swagger
 * /{userId}/book/{bookId}:
 *   post:
 *     tags: 
 *      - offers
 *     description: Create an offer for a book
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The created offer
 *       500:
 *         description: Error message
 */
router.post("/:userId/book/:bookId", checkToken, async (req,res)=>{
    jwt.verify(req.token, "my_secret_key", async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
          } else {
        try {
            const bookToAdd = await BookModel.findById(req.params.bookId);
            if (bookToAdd){
                const offer = await OfferModel.create({ bookOne: bookToAdd, OwnerOneOk: false, OwnerTwoOk: false });
                await UserModel.findByIdAndUpdate(req.params.userId, { $push: { offers: offer._id } });
                res.status(200).json(offer);
            }   
        } catch (error) {
            res.status(500).json({ message: error.message });
        }}
    });
})

/**
 * @swagger
 * /{userId}/book/{bookId}/{offerId}:
 *   patch:
 *     tags: 
 *      - offers
 *     description: Add a book to an offer
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The offer ID
 *     responses:
 *       200:
 *         description: The updated offer
 *       500:
 *         description: Error message
 */

router.patch("/:userId/book/:bookId/:offerId", checkToken, async (req,res)=>{
    jwt.verify(req.token, "my_secret_key", async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
          } else {
        try {
            const bookToAdd = await BookModel.findById(req.params.bookId);
            const offer = await OfferModel.findById(req.params.offerId);
            if (bookToAdd && offer){
                const offerUpdated = await OfferModel.findByIdAndUpdate(req.params.offerId, { bookTwo: bookToAdd, OwnerTwoOk: true }, {new: true} );
                res.status(200).json(offerUpdated);
            }  else {
                res.status(404).send("Book or Offer not found");
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }}
    });
})

/**
 * @swagger
 * /accept/{offerId}:
 *   patch:
 *     tags: 
 *      - offers
 *     description: Accept an offer
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The offer ID
 *     responses:
 *       200:
 *         description: The accepted offer
 *       500:
 *         description: Error message
 */
router.patch("/accept/:offerId", checkToken, async (req,res)=>{
    jwt.verify(req.token, "my_secret_key", async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
          } else {
        try {
            const offer = await OfferModel.findById(req.params.offerId);
            if (offer){
                await OfferModel.findByIdAndUpdate(req.params.offerId, { OwnerOneOk: true }, {new: true} );
                res.status(200).json(offer);
            } 
        } catch (error) {
            res.status(500).json({ message: error.message });
        }}
    });
})

/**
 * @swagger
 * /{userId}:
 *   get:
 *     tags: 
 *      - offers
 *     description: Get all offers from a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user's offers
 *       500:
 *         description: Error message
 */
router.get("/:userId", checkToken, async (req,res)=>{
    jwt.verify(req.token, "my_secret_key", async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
          } else {
        try {
            const offers = await OfferModel.find({ $or: [ { bookOne: { $elemMatch: { _id: req.params.userId } } }, { bookTwo: { $elemMatch: { _id: req.params.userId } } } ] });
            res.status(200).json(offers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }}
    });
})

/**
 * @swagger
 * /{offerId}:
 *   delete:
 *     tags: 
 *      - offers
 *     description: Delete an offer
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The offer ID
 *     responses:
 *       200:
 *         description: The deleted offer
 *       500:
 *         description: Error message
 */
router.delete("/:offerId", checkToken, async (req,res)=>{
    jwt.verify(req.token, "my_secret_key", async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
          } else {
        try {
            const offer = await OfferModel.findById(req.params.offerId);
            if (offer){
                await OfferModel.findByIdAndDelete(req.params.offerId);
                await UserModel.findByIdAndUpdate(offer.bookOne, { $pull: { offers: req.params.offerId } });
                res.status(200).json(offer);
            } 
        } catch (error) {
            res.status(500).json({ message: error.message });
        }}
    })
})













module.exports = router;