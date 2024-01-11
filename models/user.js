//creating the user Schema for validation process
//importing the mongoose
const mongoose=require('mongoose');
//importing the multer for each model(for specific settings)
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars');

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
    },
    avatar:{
        type:String
    }
},{
    timestamps:true
});

//Disk Storage: Storing file on the disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})

//static methods to be available to all users
userSchema.statics.uploadedAvatar= multer({ storage: storage }).single('avatar');
userSchema.statics.avatarPath=AVATAR_PATH;

// creating the model
const User=mongoose.model('User', userSchema);
//exporting the model
module.exports=User;