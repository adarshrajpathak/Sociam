//exporting the function to the user route
module.exports.profile=function(req,res){
    // res.end("<h1>Howdy!! It's your profile</h1>");
    res.render('./profile',{
        title:'Social-Media WebApp',
        author:'Adarsh Raj Pathak',
        year:2023,
        major:1,
        minor:0,
        patch:0
    })
}