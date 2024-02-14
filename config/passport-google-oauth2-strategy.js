//import the passport module
const passport=require('passport');
//importing the passport google strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//importing crypto for random password generation
const crypto=require('crypto');
//importing the User Model for finding user and creating user
const User=require('../models/user');
const env=require('./environment');
//tell passport to use google strategy
passport.use(new GoogleStrategy({
    clientID: env.google_client_ID, //GOOGLE_CLIENT_ID
    clientSecret: env.google_client_Secret,  //GOOGLE_CLIENT_SECRET
    callbackURL: env.google_callback_URL
  },
  function(accessToken, refreshToken, profile, done) {  //profile contains user-info
    //find a user
    User.findOne({ email: profile.emails[0].value })
    .exec()
    .then((user)=>{
        // console.log(profile);
        if(user){
            //if user found set in the req.user
            return done(null,user);
        }else{
            //if not found create user and set it as req.user
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            }).then((user)=>{
                return done(null, user);
            }).catch((err)=>{
                console.log('Error in creating user in passport google startegy',err);
                return;
            });
        }
    }).catch((err)=>{
        console.log('Error in google startegy passport'+err);
        return;
    })
    }
));