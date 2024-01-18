//importing the configured kue method as module
const queue=require('../config/kue');
//importing the commentMailer for emailing
const commentMailer=require('../mailers/comments_mailer');

//tell worker whenever new work added process that, (process function calls mailer)
queue.process('emails',function(job,done){  //queue-name, callback(commentdata,callback)
    console.log('emails worker is processing a job',job.data);
    //function which needed to be executed
    commentMailer.newComment(job.data);
    done();
});