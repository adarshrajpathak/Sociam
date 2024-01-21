//importing the Post model for displaying the posts on home page
const Post=require('../models/post');
//importing the Comment model for diplaying the comments on the home page alongwith posts
const Comment=require('../models/comment');
//importing the User model for displaying the friends on the separate section of Friends
const User=require('../models/user');

//exporting and creating action functions to provide to the routers
// module.exports.home=function(req,res){
//     //cookies exploration
//     // console.log(req.cookies);
//     // res.cookie('name',"Adarsh Raj Pathak");
//     // res.end("<h1>Express Home Router, Controller is up !!</h1>")
//     Post.find({}).
//     populate('user').   //first field to populate
//     populate({          //another field to populate
//         path:'comments',
//         populate:{      //multi-level populate
//             path:'user'
//         }
//     })
//     .exec() //not necessarily needed here
//     .then((posts)=>{
//         User.find({})
//         .then((users)=>{
//             return res.render('./home',{
//                 posts:posts,
//                 all_users:users,
//                 title:'Sociam',
//                 author:'Adarsh Raj Pathak',
//                 year:2023,
//                 major:1,
//                 minor:0,
//                 patch:0
//             })
//         }).catch((err)=>{
//             if(err){
//                 return console.log("Error in fetching users" +err);
//             }
//         })
//     }).catch((err)=>{
//         if(err){
//             console.log("Error in fetching posts" +err);
//         }
//     })
// }

//method 3 Responding to the browser-request using async-await(more than 1 callback)
module.exports.home= async function(req,res){
    //to catch any error in await statement
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
            },
            populate:{         
                path:'likes'
            },
            populate: {
                path: 'likes',
                populate: {
                    path: 'user',
                    select: '_id'
                }
            }
        })    
        .populate({
            path: 'likes',
            populate: {
                path: 'user',
                select: '_id'
            }
        });  
        let users=await User.find({});
        // console.log(req.user._id);
        return res.render('./home',{
            deviceUser:req.user,
            posts:posts,
            all_users:users,
            title:'Sociam',
            author:'Adarsh Raj Pathak',
            year:2023,
            major:1,
            minor:0,
            patch:0    
        })
        }catch(err){
        console.log("Error Occured", err);
    }
}
