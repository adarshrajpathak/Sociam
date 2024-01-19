//import the express module
const express=require('express');
//createing instance router that help to separate the route & controller
const router=express.Router();
//importing the home controller
const homeController=require('../controllers/home_controller');

//testing Hello World
// console.log("Router is working Great!");

//for the root level routes
router.get('/',homeController.home);
//putting the middleware to transfer the /xyz request
// router.use('/login',require('./login'));
// router.use('/signup',require('./signup'));
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/likes',require('./likes'));
//router for the api requests
router.use('/api',require('./api'));

//exporting router config to all files so that index.js(parent) can use it
module.exports=router;