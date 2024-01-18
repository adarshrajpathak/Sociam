//importing nodemailer module to send mail from server
const nodemailer=require('nodemailer');
//importing ejs engine for template rendering
const ejs=require('ejs');
const path=require('path');
//configuration from which sending mail
let transporter = nodemailer.createTransport({
    service: "gmail",
    host:'smtp.gmail.com',  //with Gmail SMTP server
    port: 587,  //default 25but for SSL/TLS working 587
    secure: false,  //two factor authentication
    auth: { //authentication object
      user: "adarsh.raj.pathak.001@gmail.com",
      pass: "sovr xavd enqx vamb",
    },
});

//define that we are using template engine
let renderTemplate=(data,relativePath)=>{   //relativePath from which function is called
    let mailHTML;
    ejs.renderFile( //used to render template from a file
        path.join(__dirname,'../views/mailer',relativePath),    //further path
        data,
        function(err,template){ //template is mix of above two
            if(err){
                console.log('error in rendering template',err);
                return;
            }
            mailHTML=template;
        }
    )
    // console.log("mailHTML"+mailHTML);
    return mailHTML;
}
//exporting this module for further use
module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}