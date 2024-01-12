//import the passport module
const passport=require('passport');
//importing the passport jwt startegy
const JWTStrategy = require('passport-jwt').Strategy;
//importing the extractjwt module to extract from authorization header request
const ExtractJWT = require('passport-jwt').ExtractJwt;
//needing user for authentication/ if user exists
const User=require('../models/user');

var opts = {    //options
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:'sociam_arp'
    // issuer:
    // audience:
}
  
passport.use(new JWTStrategy(opts, function(jwtPayLoad, done) {    //options, verify
    User.findById(jwtPayLoad._id)
    .then((user)=>{
        if (user) { //if token has been compromised then user must match
            return done(null, user);
        } else {
            return done(null, false);
        }
    }).catch((err)=>{
        if (err) {
            console.log('Error in finding user information from JWT')
            return done(err, false);
        }
    })
}));

module.exports=passport;