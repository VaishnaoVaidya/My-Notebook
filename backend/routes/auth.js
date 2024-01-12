const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
// const { json } = require('body-parser');

const JWT_SECRET = 'VaishnolovesVaishnavi'

// Route 1: Create a user using: POST "/api/auth/createuser" . No require loggin
router.post('/createuser',
  [
    body('name', 'Enter a vaild Name').isLength({ min: 3 }),
    body('email', 'Enter a vaild Email').isEmail(),
    body('password', 'Password must be atleast 5 Characters').isLength({ min: 5 }),
  ], async (req, res) =>
{
  let success = false;
  // If there are errors , return Bad request and the error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    //Check weather the user with this email exist already

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({success, error: "Sorry a user with this email already exist" })
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // create new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })

    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
  
    // res.json(user)
    success = true;
    res.json({ success,  authToken })

    //catch error
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
});

// Route 2: Authenticate a user using: POST "/api/auth/login" . No require loggin

router.post('/login',
  [
    body('email', 'Enter a vaild Email').isEmail(),
    body('password', 'Passsword cannot be blank').exists(),

  ], async (req, res) =>
  {
    let success = false;
    // If there are errors , return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({ errors: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({ success, errors: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success ,authToken })

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error")
    }
  })

// Route 3: Get loggedin  User Details using: POST "/api/auth/getUser" .  Loggin require
router.post('/getuser',fetchuser, async (req, res) =>
{
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
})

module.exports = router;