//importing mongoose module
const mongoose=require('mongoose');
const env=require('./environment');
//connecting to the mongoDB
mongoose.connect(`mongodb://127.0.0.1:27017/${env.db_name}`);

//acquring the connection
const db=mongoose.connection;

db.on('error',console.error.bind(console,'Error connecting to db'));
db.once('open',function(){
    console.log('connected to Database:: MongoDB');
});

module.exports=db;