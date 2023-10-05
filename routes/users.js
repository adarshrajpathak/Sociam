//importing the express module
const express=require('express');
const router=express.Router();

// importing the profile controller
const profileController=require('../controllers/profile_controller');

//for the profile level routes
router.get('/profile',profileController.profile);

//exporting the router config maybe
module.exports=router;