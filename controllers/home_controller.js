//exporting and creating action functions to provide to the routers
module.exports.home=function(req,res){
    res.end("<h1>Express Home Router, Controller is up !!</h1>")
}