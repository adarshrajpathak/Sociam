//importing kue module for priority job queue(or say delayed job)
const kue=require('kue');
//assigning kue module method
const queue=kue.createQueue();

//exporting the queue method
module.exports=queue;

//first start redis server $sudo snap start redis.server
//for graphical Dashboard
// $./node_modules/kue/bin/kue-dashboard ->http://127.0.0.1:3000/

