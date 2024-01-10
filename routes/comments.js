//require the Express Module
const express=require('express');
//creating the instance of the router(help to separate route and controller)
const router=express.Router();
//importing the passport module
const passport=require('passport');

//importing the controller
const commentsController=require('../controllers/comments_controller');

//post feature only available when the user is signed in
router.post('/create',passport.checkAuthentication, commentsController.create);

//get request to delete the comment
router.get('/destroy/:id',passport.checkAuthentication, commentsController.destroy);

//making this file available for the index.js(or all)
module.exports=router;