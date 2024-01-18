//importing the parser module
const bodyParser=require('body-parser');
const User = require('../models/user');
//importing the file and path module for avatar detecting and unlinking
const fs=require('fs');
const path=require('path');
//importing the access Token schema
const AccessToken=require('../models/accessToken');
//importing crypto for random accessToken generation
const crypto=require('crypto');
//importing queue for adding job of mailing after new comment created
const queue=require('../config/kue');
//also importing worker 
const resetPasswdEmailWorker=require('../workers/reset_passwd_email_worker');

//exporting the function to the user route
module.exports.profile=function(req,res){
    // res.end("<h1>Howdy!! It's your profile</h1>");
    User.findById(req.params.id.trim())
    .then(u=>{
        // console.log(u);
        return res.render('profile',{            //return
            profile_user:u,
            title:'Sociam',
            author:'Adarsh Raj Pathak',
            year:2023,
            major:1,
            minor:0,
            patch:0
        })
    }).catch((err)=>{
        console.log("error in fetching the User Details"+ err);
    })
}
//for profile update
module.exports.update= async function(req,res){
    //conversion to encty=mutlipart/form-data adds new body object and file object
    if(req.user.id==req.params.id){
        try{
            let user= await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log('Multer Error:',err)}
                // console.log(req.body);
                // console.log(req.file);
                user.name=req.body.name;    //accessed via the static function uploadedAvatar
                user.email=req.body.email;
                if(req.file){
                    //checking if avatar exits and available to the user(at both db&server)
                    if(user.avatar  //there is file ref. in the user instance of db
                        &&
                        fs.existsSync(path.join(__dirname, '..', user.avatar))){  //file exits on server

                        //deleting the avatar if exists then delete it
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    //saving the path of uploaded file into the avatar field in the user
                    user.avatar=User.avatarPath+'/'+req.file.filename;
                }
                user.save();
                req.flash('success','Credentials Updated Successfully');
                return res.redirect('back');
            })
        }catch(err){
            console.log("Error Updating Credentials");
            req.flash('error',"Error Updating Credentials")
        }
    }else{
        console.log('Unable to update the credentials');
        return res.status(401).send('Unauthorized');
    }

    // check user loggedin and Update to be made
    // if(req.user.id==req.params.id){
    //     User.findByIdAndUpdate(req.params.id, {name:req.body.name, email:req.body.email})
    //     .then((user)=>{
    //         req.flash('success','Credentials Updated Successfully');
    //         return res.redirect('back');
    //     }).catch((err)=>{
    //         console.log("Error in Updating the profile Details"+ err);
    //         req.flash('error',"Credentails didn't updated");
    //         return res.redirect('back');
    //     })
    // }else{
    //     console.log('Unable to update the credentials');
    //     return res.status(401).send('Unauthorized');
    // }
}

//login action
module.exports.login=function(req,res){
    return res.render('login',{                //return
        title:'Sociam',
        author:'Adarsh Raj Pathak',
        year:2023,
        major:1,
        minor:0,
        patch:0
    })
}

//signup action
module.exports.signup=function(req,res){
    return res.render('signup',{               //return
        title:'Sociam',
        author:'Adarsh Raj Pathak',
        year:2023,
        major:1,
        minor:0,
        patch:0
    })
}

//create the user
module.exports.create=function(req,res){
    //TODO
    //checking if the password and confirm password are same or not
    if((req.body.confirmPassword)!=req.body.password){
        console.log("Confirm Password didn't matched");
        return res.redirect('back');
    }
    //cheking if the email already exits of not
    User.findOne({email:req.body.email})
    .then((oldUser)=>{
        if(!oldUser){
            //all tests passed now store the data
            User.create(req.body)
            .then((newUser)=>{
                if(newUser){
                    console.log("Added the NewUser Successfully!");
                    // console.log(newUser);
                    req.flash('success','Successfully Signed Up');
                    return res.redirect('/users/login');
                }
            }).catch((err)=>{
                console.error.bind(`Error in creating the new User: ${err}`);
            })
        }else{
            console.log('already exits');
            req.flash('error','User Already Exists');
            console.log(oldUser);
            return res.redirect('back');
        }
    }).catch((err)=>{
        console.error.bind(`Error in fetching the existing email: ${err}`);
    })
}
//create the session
module.exports.createSession=function(req,res){
    //when the authentication done
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}

//signout action
module.exports.signout=function(req,res){
    //logout
    req.logout(function(err){
        if(err){
            console.log(`Error in loggin out: ${err}`);
        }
        req.flash('success','You have Logged Out');
        res.redirect('/');
    });
}

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
