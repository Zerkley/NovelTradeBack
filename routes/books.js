var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const checkToken = require('../services/verification');
const UserModel = require('../models/users_model');
const BookModel = require('../models/books_model');

/**
 * @swagger
 * /{userId}:
 *   post:
 *     tags: 
 *      - books
 *     description: Create a book for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: body
 *         name: book
 *         description: The book to create
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             type:
 *               type: string
 *             state:
 *               type: string
 *             publishedYear:
 *               type: number
 *             genre:
 *               type: string
 *             author:
 *               type: string
 *             size:
 *               type: string
 *             picture:
 *               type: string
 *     responses:
 *       200:
 *         description: The created book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Error message
 */
router.post("/:userId", checkToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
        } else {
            try {
                const book = await BookModel.create({ ...req.body, owner: req.params.userId });
                if (book) {
                    await UserModel.findByIdAndUpdate(req.params.userId, { $push: { books: book._id } });
                    res.status(200).json(book);
                }
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    });
});

/**
 * @swagger
 * /{userId}:
 *   get:
 *     tags: 
 *      - books
 *     description: Get all books from a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: An array of books
 *       500:
 *         description: Error message
 */
router.get("/:userId", checkToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
        } else {
            try {
                const books = await BookModel.find({ owner: req.params.userId });
                res.status(200).json(books);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    });
});

/**
 * @swagger
 * /all/{userId}:
 *   get:
 *     tags: 
 *      - books
 *     description: Get all books except the ones from the user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: An array of books
 *       500:
 *         description: Error message
 */

router.get("/all/:userId", checkToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
        } else {
            try {
                const books = await BookModel.find({ owner: { $ne: req.params.userId } });
                res.status(200).json(books);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    });
});

/**
 * @swagger
 * /book/{bookId}:
 *   get:
 *     tags: 
 *      - books
 *     description: Get a book by book id
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The book
 *       500:
 *         description: Error message
 */

router.get("/book/:bookId", checkToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
        } else {
            try {
                const book = await BookModel.findById(req.params.bookId);
                res.status(200).json(book);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    });
});

/**
 * @swagger
 * /book/{bookId}:
 *   patch:
 *     tags: 
 *      - books
 *     description: Edit a book by book id
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *       - in: body
 *         name: book
 *         description: The book to edit
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             type:
 *               type: string
 *             state:
 *               type: string
 *             publishedYear:
 *               type: number
 *             genre:
 *               type: string
 *             author:
 *               type: string
 *             size:
 *               type: string
 *             picture:
 *               type: string
 *     responses:
 *       200:
 *         description: The edited book
 *       500:
 *         description: Error message
 */

router.patch('/book/:bookId', checkToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
        } else {
            try {
                const book = await BookModel.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
                res.status(200).json(book);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    });
})

/**
 * @swagger
 * /book/{bookId}:
 *   delete:
 *     tags: 
 *      - books
 *     description: Delete a book by book id
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book deleted message
 *       500:
 *         description: Error message
 */

router.delete('/book/:bookId', checkToken, async (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            res.sendStatus(403); //forbidden status
        } else {
            try {
                await BookModel.findByIdAndDelete(req.params.bookId);

                await UserModel.updateMany(
                    { books: req.params.bookId },
                    { $pull: { books: req.params.bookId } }
                );

                res.status(200).json('Book deleted');
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    });
})

module.exports = router;