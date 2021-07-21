const express =require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const normalize = require('normalize-url');
const jwt =require('jsonwebtoken')
const { check , validationResult } = require('express-validator');

const route =express.Router();

const User =require('../../models/User');
const { JsonWebTokenError } = require('jsonwebtoken');

/*
const Funcheck=(req,res,next)=>{
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
      ).isLength({ min: 6 })
}
*/


//uptill now the data in the post is coming from postman

route.post('/',

check('name', 'Name is required').notEmpty(),
check('email', 'Please include a valid email').isEmail(),
check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  
  

  
   
 async (req,res)=>{
    const error = validationResult(req);
    console.log(req.body.email)
    if(!error.isEmpty()){
        return res.status(400).json({error : error.array()})
        
    }

    //putting request to variable which is later passed to user object

    const { name, email, password } = req.body;

    try {

        //checking if user already exists by using moongo instance
  
        let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      //getting gravatar
      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );

      //collection made of the model
        user = new User({
            name,
            email,
            avatar,
            password
          });
    //encrypting password
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
    
          // saving user to mongodb
          await user.save();

          //jwt auth

          const payload ={
            user :{
              id: user.id
            }   
          }

          jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:36000000},
            (err,token) =>{
              if(err) throw err;

              //this is the response we are sending to the client
              res.json({token});
              
            }
            )

    
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
    
})

module.exports = route;
