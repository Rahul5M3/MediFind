let User=require('./models/user.js');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
         res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

// module.exports.checkUserInfo=async (req,res,next)=>{
//     let user=await User.find({username:req.body.username,email:req.body.email});
//     console.log(user);
//     if(user.length>0){
//         next();
//     }else {
//         res.redirect('/login');
//     }
// }