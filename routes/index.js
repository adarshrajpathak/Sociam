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
//putting the middleware to transfer the /users request
router.use('/users',require('./users.js'));

//exporting router config to all files so that index.js can use it
module.exports=router;