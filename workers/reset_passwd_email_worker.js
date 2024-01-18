//importing the configured kue method as module
const queue=require('../config/kue');
//importing the reset_password_mailer for emailing
const resetPasswdMailer=require('../mailers/reset_password_mailer');

//tell worker whenever new work added process that, (process function calls mailer)
queue.process('priorityEmails',function(job,done){  //queue-name, callback(commentdata,callback)
    // console.log('priorityEmails worker is processing a job',job.data);
    //function which needed to be executed
    resetPasswdMailer.newAccessToken(job.data);
    done();
});