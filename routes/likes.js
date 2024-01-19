//require the Express Module
const express=require('express');
//creating the instance of the router(help to separate route and controller)
const router=express.Router();
//importing the passport module
const passport=require('passport');

//importing the controller
const likesController=require('../controllers/likes_controller');

//get feature only available when the user is signed in and toggle like
router.get('/toggle',passport.checkAuthentication, likesController.toggleLike);

//making this file available for the index.js(or all)
module.exports=router;