// exporting the function (specifically for posts route)
module.exports.feed=function(req,res){
    // res.end("<h1> Welcome To the post page </h1>");
res.render('posts',{
        title:'Social-Media WebApp',
        author:'Adarsh Raj Pathak',
        year:2023,
        major:1,
        minor:0,
        patch:0
    })
}