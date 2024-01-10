//creating custom middleware to store in response the flash request
module.exports.setFlash=function(req,res,next){
    res.locals.flash={
        'success':req.flash('success'),
        'error':req.flash('error')
    }
    next();
}