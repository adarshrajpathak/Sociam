const User = require('../models/user');
//importing the access Token schema
const AccessToken=require('../models/accessToken');
//importing crypto for random accessToken generation
const crypto=require('crypto');
//importing queue for adding job of mailing after new token created
const queue=require('../config/kue');
//also importing worker 
const resetPasswdEmailWorker=require('../workers/reset_passwd_email_worker');   //automatically process it once appended to the quue

//exporting the function to the passwords route
//for forget password
module.exports.resetPass=function(req,res){
    return res.render('reset_password',{                //return
        title:'Sociam',
        author:'Adarsh Raj Pathak',
        year:2023,
        major:1,
        minor:0,
        patch:0
    }
)}

module.exports.createToken=function(req,res){
    User.findOne({email:req.body.email})
    .then((user)=>{
        if(user){
            AccessToken.create({
                accessToken:crypto.randomBytes(12).toString('hex'),
                user:user._id,
                isValid:true,
            })
            .then(async function(accesstoken){
                await accesstoken.populate('user','name email');
                // console.log(accesstoken);
                let job=queue.create('priorityEmails',accesstoken).save(function(err){  //queue-name(appendorCreate if not exits, data/email/info)
                    if(err){
                        console.log('error in creating a priorityEmails queue',err);
                        return;
                    }
                    console.log('Email job enqueued',job.id); //job id available just after created
                });
            }).catch((err)=>{
                console.error.bind(`Error in creating the new accessToken: ${err}`);
            })
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        email:user.email,
                    },
                    message:"Reset Email Sent",
                    notyText:'Reset Email Sent!!'
                })
            }
            // return res.render('login',{                //return
            //     title:'Sociam',
            //     author:'Adarsh Raj Pathak',
            //     year:2023,
            //     major:1,
            //     minor:0,
            //     patch:0
            // })        
        }else{
            module.exports.signup=function(req,res){
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            email:user.email,
                        },
                        message:"Wrong Password Type again",
                        notyText:'No Such Email Found, Enter again!!'
                    })
                }
                return res.render('signup',{               //return
                    title:'Sociam',
                    author:'Adarsh Raj Pathak',
                    year:2023,
                    major:1,
                    minor:0,
                    patch:0
                })
            } 
        }
    })
}

//serving new password form
module.exports.servePasswordForm=function(req,res){
    // console.log(req.params.id);
    AccessToken.findOne({accessToken: req.params.id.trim()})
    .then((accesstoken)=>{
        // console.log(accesstoken);
        if(accesstoken && accesstoken.isValid){
            return res.render('create_password',{                //return
                accessToken:accesstoken.accessToken,
                title:'Sociam',
                author:'Adarsh Raj Pathak',
                year:2023,
                major:1,
                minor:0,
                patch:0
            })
        }else{
            return res.send('<h1>AccessToken Expired<h1>');
        }
    }).catch((err)=>{
        if(err){
            console.log('error in fetching user using accesstoken',err);
        }
    })
}

module.exports.updatePassword=function(req,res){
    //if new password and confirm password are not same
    if(req.body.password!=req.body.confpassword){
        if(req.xhr){
            return res.status(200).json({
                indication:false,
                message:"Password and Confirm Password didn't match",
                notyText:"Password and Confirm Password didn't match!!"
            })
        } 
    }
    AccessToken.findOne({accessToken:req.params.id.trim()})
    .then((accesstoken)=>{
        if(accesstoken.isValid){
            accesstoken.isValid=false;
            accesstoken.save();
            User.findById(accesstoken.user)
            .then((user)=>{
                user.password=req.body.password;
                user.save();
                accesstoken.deleteOne();    //delete the access token
                return res.status(200).json({
                    indication:true,
                    data:{
                        email:user.email,
                    },
                    message:"Password Created",
                    notyText:'New Password Created!!'
                })
            }).catch((err)=>{
                if(err){
                    console.log('Error in updating password'+err);
                }
            })
        }else{
            if(req.xhr){
                return res.status(200).json({
                    indication:false,
                    data:{
                        email:user.email,
                    },
                    message:"Access Token Expired",
                    notyText:'Access Token Expired!!'
                })
            } 
        } 
    }).catch((err)=>{
        console.log('Error in updating new password'+err);
    })
}
