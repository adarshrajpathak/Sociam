//importing passport module to check authentication of api as middleware
const passport=require('passport');
//import the express module
const express=require('express');
//createing instance router that help to separate the route & controller
const router=express.Router();

const postApi=require('../../../controllers/api/v1/posts_api');

router.get('/',postApi.index);
//Authentication
router.delete('/:id',passport.authenticate('jwt',{session:false}),postApi.destroy); //prevent session cookie to be generated

//exporting router config to all files so that index.js(of v1) can use it
module.exports=router;