//import node mailer configuration module
const nodemailer=require('../config/nodemailer');

module.exports.newComment=(comment)=>{
    // console.log('inside newComment mailer');
    // console.log(comment);
                                             //data and relative path
    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
    // console.log(htmlString);
    // send mail with defined transport object

    nodemailer.transporter.sendMail({
        from: "adarsh.raj.pathak.001@gmail.com", // sender address
        to: comment.user.email, // list of receivers or single receiver
        subject: "New Awesome Comment published", // Subject line
        text: "Hello world?", // plain text body
        html: htmlString, //"<h1>Yup, Your comment is now published!!</h1>" html body
    },(err,info)=>{ //callback function
        if(err){
            console.log('Error in sending email', err);
            return;
        }
        console.log("Message sent",info);
    });
}
