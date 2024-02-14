//importing nodemailer module to send mail from server
const nodemailer=require('nodemailer');
//importing ejs engine for template rendering
const ejs=require('ejs');
const path=require('path');
const env=require('./environment');
//configuration from which sending mail
let transporter = nodemailer.createTransport(env.smtp);

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