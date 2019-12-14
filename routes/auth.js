const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');

router.get('/', (req,res) => {
  res.send('Get logged in user');
});

router.post('/', [
  check('email', 'Please enter a valid Email').isEmail(),
  check('password', 'Password is required').exists()
],
async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }

  const {email, password} = req.body;

  try{
    let user = await User.findOne({email});

    if(!user){
      return res.status(400).json({msg : 'Invalid email or password'});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).json({msg : 'Invalid email or password'});
    }

    const payload ={
      user : {
        id : user.id
      }
    };

    jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn : 36000
    }, (err, token) => {
      if(err) throw err;
      res.json({
        token
      });
    });
  }catch(err){
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
