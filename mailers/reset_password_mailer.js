//import node mailer configuration module
const nodemailer=require('../config/nodemailer');

module.exports.newAccessToken=(accesstoken)=>{
    // console.log(accesstoken);
                                             //data and relative path
    let htmlString=nodemailer.renderTemplate({accesstoken:accesstoken},'/passwords/reset_password.ejs');
    // console.log(htmlString);
    // send mail with defined transport object

    nodemailer.transporter.sendMail({
        from: "adarsh.raj.pathak.001@gmail.com", // sender address
        to: accesstoken.user.email, // list of receivers or single receiver
        subject: "Reset Your Sociam Pasword", // Subject line
        text: "This is the form to submit here", // plain text body
        html: htmlString, // html body
    },(err,info)=>{ //callback function
        if(err){
            console.log('Error in sending reset passwd email', err);
            return;
        }
        console.log("Reset Link sent",info);
    });
}
