//creating the user Schema for validation process
//importing the mongoose
const mongoose=require('mongoose');
//creating the schema
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

// creating the model
const User=mongoose.model('User', userSchema);
//exporting the model
module.exports=User;