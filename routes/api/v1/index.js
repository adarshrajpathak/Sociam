//import the express module
const express=require('express');
//createing instance router that help to separate the route & controller
const router=express.Router();

//router for the api/v1/posts requests
router.use('/posts',require('./posts'));
//router for the api/v1/users requests
router.use('/users',require('./users'));

//exporting router config to all files so that index.js(of api) can use it
module.exports=router;