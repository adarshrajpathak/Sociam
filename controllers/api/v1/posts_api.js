//importing posts schema module
const Post=require('../../../models/post');
//importing comments schema module
const Comment=require('../../../models/comment');

//making the controller for the post api request
module.exports.index=async function(req,res){
    try{
        let posts=await Post.find({}).
        sort('-createdAt'). //decending order of creation for ascending sor('createdAt')
        populate('user','-password').   //first field to populate
        populate({          //another field to populate
            path:'comments',
            options: { sort: { 'createdAt': -1 } }, //sort the comments in reverse order
            populate:{      //multi-level populate
                path:'user',
                select:'-password'
            }
        });
        res.status(200).json({
            message:"List of Posts",
            posts:posts
        })
    }catch(err){
        console.log("Error Occured", err);
    }
}

//making the controller for the post api delete request
module.exports.destroy=function(req,res){
    Post.findById(req.params.id.trim())
    .then((post)=>{
        //if the user of post and user requested to delete are same(already taken care by mw)
        if(post.user==req.user.id){
            //remove the post
            post.deleteOne()
            //remove all the comments associated with the post
            .then(()=>{Comment.deleteMany({post:req.params.id})})
            .then((comment)=>{
                console.log("Deleted the Post & associated comments");
                return res.status(200).json({
                    data:{
                        post_id:req.params.id.trim()
                    },
                    message:"Post Deleted",
                    notyText:'Post and Associated Comments Deleted!!'
                })
            })
            .catch((err)=>{
                console.log("Not the genuine user to delete comment"+err);
                return res.status(500).json({
                    message:"Internal Server Error"
                })
            })
        }else{
            req.flash('error','Unable to delete the post');
            return res.status(401).json({
                message:"unauthorised to delete the post"
            });
        }
    }).catch((err)=>{
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    })
}