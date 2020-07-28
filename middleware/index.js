var Comment=require("../models/comment");
var campground=require("../models/campgroud"); 
var middlewareobj={};
 
middlewareobj.checkCampgrpundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id,function(er,foundCamp){
            if(er||!foundCamp){
                req.flash("error","Campground Not Found");                
                res.redirect("/campgrounds");
            }
            else{
               if(foundCamp.user.id.equals(req.user._id)){
                    next();
               }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","Please LogIn");
        res.redirect("/login");
    }
}

middlewareobj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,function(er,foundComment){
            if(er||!foundComment){
                req.flash("error","Comment Not Found");                
                res.redirect("/campgrounds");
            }
            else{
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               }
                else{
                res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","Please LogIn");
        res.redirect("/login");
    }
}

middlewareobj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please LogIn");
    res.redirect("/login");
}

module.exports=middlewareobj;