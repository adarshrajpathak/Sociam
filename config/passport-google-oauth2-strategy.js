//import the passport module
const passport=require('passport');
//importing the passport google strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//importing crypto for random password generation
const crypto=require('crypto');
//importing the User Model for finding user and creating user
const User=require('../models/user');

//tell passport to use google strategy
passport.use(new GoogleStrategy({
    clientID: "702679840438-e3i7l8mrj571lgcnu1on7avj49gbhhrq.apps.googleusercontent.com", //GOOGLE_CLIENT_ID
    clientSecret: "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",  //GOOGLE_CLIENT_SECRET
    callbackURL: "http://localhost:8000/users/auth/google/callback"
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