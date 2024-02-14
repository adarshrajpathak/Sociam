//importing the jsonwebtoken module used to generate the jwt token
const jwt= require('jsonwebtoken');
const User=require('../../../models/user');
const env=require('../../../config/environment');

module.exports.createSession=async function(req,res){
    try{
        let user=await User.findOne({email:req.body.email});
        //user not found
        if(!user || user.password!=req.body.password){
            return res.status(400).json({   //invalid user input
                message:"Invalid username or Password"
            })
        }
        return res.status(200).json({
            message:'Sigin successful, dropping your jwt token',
            data:{  //sing(payload,secretOrPrivateKey, [options,callback])
                token:jwt.sign(user.toJSON(),env.jwt_secret_key,{expiresIn:'100000'})
            }
        })
    }catch(err){
        console.log(err);
        return res.status(501).json({
            message:"Internal Server Error"
        })
    }
}