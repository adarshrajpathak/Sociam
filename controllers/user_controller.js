//importing the parser module
const bodyParser=require('body-parser');
const User = require('../models/user');
//importing the file and path module for avatar detecting and unlinking
const fs=require('fs');
const path=require('path');

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
                    return res.redirect('/user/login');
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