//importing the parser module
const bodyParser=require('body-parser');
const User = require('../models/user');

//exporting the function to the user route
module.exports.profile=function(req,res){
    // res.end("<h1>Howdy!! It's your profile</h1>");
    return res.render('profile',{            //return
        title:'Social-Media WebApp',
        author:'Adarsh Raj Pathak',
        year:2023,
        major:1,
        minor:0,
        patch:0
    })
}

//login action
module.exports.login=function(req,res){
    return res.render('login',{                //return
        title:'Social-Media WebApp',
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
        title:'Social-Media WebApp',
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
                    return res.redirect('/user/login');
                }
            }).catch((err)=>{
                console.error.bind(`Error in creating the new User: ${err}`);
            })
        }else{
            console.log('already exits');
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
    return res.redirect('/user/profile');
}

//signout action
module.exports.signout=function(req,res){
    //logout
    req.logout(function(err){
        if(err){
            console.log(`Error in loggin out: ${err}`);
        }
        res.redirect('/');
    });
}