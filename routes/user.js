//importing the express module
const express=require('express');
const router=express.Router();

// importing the profile controller
const userController=require('../controllers/user_controller');

//for the profile level routes
router.get('/profile',userController.profile);

router.get('/signup',userController.signup);

router.get('/login',userController.login);

//TODO route for the signup
router.post('/create',userController.create);
//TODO route for the login
router.post('/create-session',userController.createSession);


//exporting the router config maybe
module.exports=router;