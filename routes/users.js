var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const checkToken = require('../services/verification');
const UserModel = require('../models/users_model');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/**
 * @swagger
 * /users/signup:
 *   post:
 *     description: Sign up a user
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User object
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created
 *       500:
 *         description: Error message
 */
router.post("/signup", async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      res.status(404).send("User not found");
    } else if (user.password === password) {
      const token = jwt.sign({ user }, "my_secret_key", { expiresIn: "1d" });
      res.status(200).json({
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:userEmail", checkToken, async (req, res) => {
  jwt.verify(req.token, "my_secret_key", async (err, data) => {
    if (err) {
      res.sendStatus(403); //forbidden status
    } else {
      try {
        const user = await UserModel.findOne({ email: req.params.userEmail });
        res.status(200).json(user);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
    }
  });
});

module.exports = router;
