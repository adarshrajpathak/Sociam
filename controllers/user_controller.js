//importing the parser module
const bodyParser=require('body-parser');
const User = require('../models/user');

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
module.exports.update=function(req,res){
    //check user loggedin and Update to be made
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id, {name:req.body.name, email:req.body.email})
        .then((user)=>{
            req.flash('success','Credentials Updated Successfully');
            return res.redirect('back');
        }).catch((err)=>{
            console.log("Error in Updating the profile Details"+ err);
            req.flash('error',"Credentails didn't updated");
            return res.redirect('back');
        })
    }else{
        return res.status(401).send('Unauthorized');
    }
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