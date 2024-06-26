var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const checkToken = require('../services/verification');
const { hashingService, hashingCompare } = require('../services/hashing');
const UserModel = require('../models/users_model');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags: 
 *      - users
 *     description: Sign up a user
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             name:
 *               type: string
 *             city:
 *               type: string
 *             phoneNumber:
 *               type: string
 *     responses:
 *       200:
 *         description: User created
 *       500:
 *         description: Error message
 */
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await hashingService(req.body.password);
    const user = await UserModel.create({...req.body, password: hashedPassword});
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: 
 *      - users
 *     description: Login a user
 *     parameters:
 *       - in: body
 *         name: credentials
 *         description: User credentials
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden (No token)
 *       500:
 *         description: Error message
 */
router.post("/login", async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
    const user = await UserModel.findOne({ email: email });
    
    if (!user) {
      res.status(404).send("User not found");
    }
    const compare = await hashingCompare(user.password, password);
    if (compare === false) {
      res.status(403).send("Wrong password or email");
    } else {
      const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "1d" });
      res.status(200).json({
        token: token,
        userId: user._id,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /users/user/{userEmail} :
 *   get:
 *     tags: 
 *      - users
 *     description: Get a user by email
 *     responses:
 *       200:
 *         description: User data
 *       403:
 *         description: Forbidden (No token)
 *       500:
 *         description: Error message
 */
router.get("/user/:userId", checkToken, async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      res.sendStatus(403); //forbidden status
    } else {
      try {
        const user = await UserModel.findOne({ _id: req.params.userId });
        res.status(200).json(user);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
    }
  });
});

/**
 * @swagger
 * /users/user/{userId}:
 *   patch:
 *     tags: 
 *      - users
 *     description: Edit a user
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             name:
 *               type: string
 *             city:
 *               type: string
 *             phoneNumber:
 *               type: string
 *             profilePicture:
 *               type: string
 *     responses:
 *       200:
 *         description: User modified
 *       403:
 *         description: Forbidden (No token)
 *       500:
 *         description: Error message
 */
router.patch("/user/:userId", checkToken, async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      res.sendStatus(403); //forbidden status
    } else {
      try {
        const user = await UserModel.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        res.status(200).json(user);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
    }
  })
});

module.exports = router;
