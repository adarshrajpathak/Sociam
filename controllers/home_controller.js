//exporting and creating action functions to provide to the routers
module.exports.home=function(req,res){
    // res.end("<h1>Express Home Router, Controller is up !!</h1>")
    res.render('./home',{
        title:'Social-Media WebApp',
        author:'Adarsh Raj Pathak',
        year:2023,
        major:1,
        minor:0,
        patch:0
    })
}