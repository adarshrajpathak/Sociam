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

// route for the signup
router.post('/create',userController.create);

//route forwarded for password related stuffs
router.use('/password',require('./passwords'));

// // route for forgetPassword
// router.get('/reset-passwd',userController.resetPass);
// //create token
// router.post('/create-token',userController.createToken);
// //create password form display
// router.get('/create-password/:id',userController.servePasswordForm);
// //create new password
// router.post('/update-password/:id',userController.updatePassword);

//TODO route for the login
// router.post('/create-session',userController.createSession);

//route for creating session using passport jwt as middleware
router.post('/create-session',
    passport.authenticate(  //passport.Authenticator.authenticate()
        'local',    //strategy
        {failureRedirect:'/users/login'}
    ),
userController.createSession);

//not callback url(it is given by passport), it send to url of google login
router.get('/auth/google',passport.authenticate('google', { scope: ['profile','email'] }));
//callback url at which recieves the data(profile)
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),   //middleware authentication
  userController.createSession);    //controller 

//exporting the router config maybe
module.exports=router;