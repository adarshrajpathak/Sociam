//require the Express Module
const express=require('express');
//creating the instance of the router(help to separate route and controller)
const router=express.Router();
//importing the passport module
const passport=require('passport');

//importing the controller
const postsController=require('../controllers/posts_controller');
//creating the route for the controller 
router.get('/feed',postsController.feed);

//post feature only available when the user is signed in
router.post('/create',passport.checkAuthentication, postsController.create);

//deleting the post feature
router.get('/destroy/:id',passport.checkAuthentication,postsController.destroy);

//making this file available for the index.js(or all)
module.exports=router;