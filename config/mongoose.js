//importing mongoose module
const mongoose=require('mongoose');

//connecting to the mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/sociam_development');

//acquring the connection
const db=mongoose.connection;

db.on('error',console.error.bind(console,'Error connecting to db'));
db.once('open',function(){
    console.log('connected to Database:: MongoDB');
});

module.exports=db;