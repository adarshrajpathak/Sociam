//importing comment schema module
const Comment=require('../models/comment');
//also have to modification in the post
const Post=require('../models/post');

//making the posts controller
module.exports.create=function(req,res){
    //check if the post is valid or not
    Post.findById(req.body.post)
    .then((post)=>{
        if(post){
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            }).then(async function(comment){
                //also add the comment to the posts array comments of the current post fetched
                post.comments.push(comment);
                post.save();
                await comment.populate('user','name'); //populate only Field Selection so, second 
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            comment:comment
                        },
                        message:"Comment Created",
                        notyText:'Comment Added!!'
                    })
                }
                req.flash('success','Comment Added!!');
                res.redirect('back');
            }).catch((err)=>{
                req.flash('error','Unable to Comment');
                console.log("Error while creating a new comment");
                res.redirect('back');
            })
        }
    }).catch((err)=>{
        console.log("there is no such post to comment", err);
    })
}
//delete the comment
module.exports.destroy=function(req,res){
    // console.log(req.params.id);
    Comment.findById(req.params.id.trim()).populate('post') //first fill the post section
    .then(comment=>{
        //checking if the user is logged in and is original author
        // console.log(comment.post.user);
        // console.log(req.user.id);
        if(comment.user._id==req.user.id || comment.post.user==req.user.id){ //or comment.user==req.user.id
            let postId=comment.post;
            comment.deleteOne();    //deleted the original comment
            //Update the comments array of the post
            Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}})
            .then(post=>{
                console.log("Deleted the comment");
                //if the delete request was ajax
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            comment_id:req.params.id.trim()
                        },
                        message:"Post Deleted",
                        notyText:'Comment Deleted'
                    })
                }
                req.flash('success','Comment Deleted');
                return res.redirect('back')
            })
            .catch(err=>{req.flash('error','Unable to delete Comment');console.log(err);return res.redirect('back')});
        }else{
            console.log("User Doesn't matched!");
            return res.redirect('back');
        }
    }).catch(err=>{
        console.log(err);
        console.log("Error in deleting the comment");
        return res.redirect('back');
    })
}