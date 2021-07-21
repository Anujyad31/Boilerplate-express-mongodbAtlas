const jwt = require('jsonwebtoken')
const config =require('config')


//the middleware is exported to some other module to be used for auth
module.exports = (req,res,next) => {
    //this is basically sending our token for authetication
    //right now we will be sending/req the header(token) via postman
const token = req.header('x-auth-token') ;

// Check if no token
if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {

    const decoded = jwt.verify(token,config.get('jwtSecret'));
    // if token is valid we can put the requested user as decoded.user as it has the payload
    //after this we could use req.user in any of our protected routes to access data for that user
        req.user = decoded.user;
        console.log(req.user.id)
        next();
    
  } catch (err) {
    console.error('Token is invaild');
    res.status(401).json({ msg: 'Token invalid' });
  }
}