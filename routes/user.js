//importing the express module
const express=require('express');
const router=express.Router();
//importing passport module for authentication
const passport=require('passport');

// importing the profile controller
const userController=require('../controllers/user_controller');

//for the profile level routes
router.get('/profile/:id', passport.checkAuthentication, userController.profile);
//for the profile update
router.post('/update/:id', passport.checkAuthentication, userController.update);

router.get('/signup', passport.checkIsNotAuthenticated, userController.signup);

router.get('/login',passport.checkIsNotAuthenticated, userController.login);

router.get('/signout',userController.signout);

//TODO route for the signup
router.post('/create',userController.create);

//TODO route for the login
// router.post('/create-session',userController.createSession);

//route for creating session using passport as middleware
router.post('/create-session',
    passport.authenticate(  //passport.Authenticator.authenticate()
        'local',    //strategy
        {failureRedirect:'/user/login'}
    ),
    userController.createSession);


//exporting the router config maybe
module.exports=router;