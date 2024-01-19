//importing the express module
const express=require('express');
const router=express.Router();

const passController=require('../controllers/passwords_controller');
//TODO route for forgetPassword
// router.get('/reset-passwd',userController.resetPass);
// router.get('/password/reset',userController.resetPass);
router.get('/reset',passController.resetPass);

//create token
// router.post('/create-token',userController.createToken);
// router.post('/password/token',userController.createToken);
router.post('/token',passController.createToken);

//create password form display
// router.get('/create-password/:id',userController.servePasswordForm);
// router.get('/password/create/:id',userController.servePasswordForm);
router.get('/create/:id',passController.servePasswordForm);

//create new password
// router.post('/update-password/:id',userController.updatePassword);
// router.post('/password/update/:id',userController.updatePassword);
router.post('/update/:id',passController.updatePassword);


//exporting the router config maybe
module.exports=router;