//import the passport module
const passport=require('passport');
//importing the startegy propery
const LocalStrategy=require('passport-local').Strategy;
//importing the model User
const User=require('../models/user');

//passport to use localStrategy
passport.use(new LocalStrategy(
{
    usernameField:'email',
    passReqToCallback:true
},
function(req,email,password,done){
    User.findOne({email:email})
    .then((user)=>{
        //if user not found
        if(!user){
            console.log(`Invalid Username`);
            req.flash('error','Invalid Username');
            return done(null, false);
        }
        //if password not same
        if(user.password!=password){
            console.log(`Invalid Password`);
            req.flash('error','Invalid Password');
            return done(null, false);
        }
        return done(null, user);
    })
    .catch((err)=>{
        console.log(`Error in finding the user ${err}`);
        req.flash('error','Error in finding the user');
        return done(err);
    })
}));

//serialize the session cookie to be sent [res.cookie('property','value');]
passport.serializeUser(function(user,done){
    return done(null,user._id);
})

//deserialize the session cookie that has been recieved [req.cookies.property_name;]
passport.deserializeUser(function(id,done){
    User.findById(id)
    .then((user)=>{
        return done(null, user);
    }).catch((err)=>{
        console.log(`Error in finding the user during deserialize ${err}`);
        return done(err);
    })
})

//creating the custom middleware to pass the data to the ejs
//basically for the profile page or anyother which require first authentication
passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    //if not authenticated
    return res.redirect('/user/login');
}
//set the user for views
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    return next();
}
//custom middleware for the login and signup pages
passport.checkIsNotAuthenticated=function(req,res,next){
    if(!req.isAuthenticated()){
        return next();  //if not authenticated then proceed further 
    }
    return res.redirect('/');   //else redirect home
}
module.export=passport;