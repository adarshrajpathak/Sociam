//require the Express Module
const express=require('express');
//creating the instance of the router(help to separate route and controller)
const router=express.Router();

//importing the controller
const postsController=require('../controllers/posts_controller');
//creating the route for the controller 
router.get('/feed',postsController.feed);

//making this file available for the index.js(or all)
module.exports=router;