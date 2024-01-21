//importing posts schema module
const Post=require('../models/post');
//importing comments schema module
const Comment=require('../models/comment');
//importing likes schema module
const Like=require('../models/Like');

// exporting the function (specifically for posts route)
module.exports.feed=function(req,res){
    // res.end("<h1> Welcome To the post page </h1>");
    return res.render('posts',{
        title:'Sociam',
        author:'Adarsh Raj Pathak',
        year:2023,
        major:1,
        minor:0,
        patch:0
    })
}

//making the posts controller
module.exports.create=function(req,res){
    Post.create({
        content:req.body.content,
        user: req.user._id
    }).then(async function(post){
        //populating the user field before sending
        await post.populate('user','name'); //populate only Field Selection so, second argument to the populate method
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post Created",
                notyText:'Post Published!!'
            })
        }
        req.flash('success','Post Published!!');
        return res.redirect('back');
    }).catch((err)=>{
        req.flash('error','Error Creating the post');
        console.log("error in creating the post");
    })
}

//making the posts destroyer controller
module.exports.destroy=function(req,res){
    Post.findById(req.params.id.trim())
    .then(async function(post){
        //if the user of post and user requested to delete are same
        if(post.user==req.user.id){
            //remove all the likes on the post
            await Like.deleteMany({likable:post,onModel:'Post'});
            //remove all the likes from the comments as well
            await Like.deleteMany({_id:{$in:post.comments}});//match:id in post.comments array
            //remove the post
            post.deleteOne()
            //remove all the comments associated with the post
            .then(()=>{Comment.deleteMany({post:req.params.id})})
            .then((comment)=>{
                console.log("Deleted the Post & associated comments");
                //if the delete request was ajax
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            post_id:req.params.id.trim()
                        },
                        message:"Post Deleted",
                        notyText:'Post and Associated Comments Deleted!!'
                    })
                }
                req.flash('success','Post and Associated Comments Deleted');
                return res.redirect('back');
            })
            .catch((err)=>{
                console.log("Not the genuine user to delete comment"+err);
                return res.redirect('back');
            })
        }else{
            req.flash('error','Unable to delete the post');
            return res.redirect('back');
        }
    }).catch((err)=>{
        console.log(err);
        req.flash('error',"You are not authorised user");
        return res.redirect('back');
    })
}