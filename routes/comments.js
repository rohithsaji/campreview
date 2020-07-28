var express=require("express");
var router=express.Router();
var campground=require("../models/campgroud");
var Comment=require("../models/comment");
var methodOverride=require("method-override");
var middleware=require("../middleware");


router.use(methodOverride("_method"));


router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
    var ID=req.params.id;
    campground.findById(ID,function(er,camp){
        if(er){
            console.log(er);
        }
        else{
            res.render("comments/new.ejs",{camp:camp});
        }
    });
});
router.get("/campgrounds/:id/comments/:commentId/edit",middleware.checkCommentOwnership,function(req,res){
    var commentId= req.params.commentId;
    campground.findById(req.params.id,function(er,camp){
        if(er||!camp){
            req.flash("error","Campground Not Found");                
            res.redirect("/campgrounds");
        }
        else{
            Comment.findById(commentId,function(er,comment){
                if(er){
                    console.log(er);
                    res.redirect("/campgrounds");
                }
                else{
                    res.render("comments/edit.ejs",{comment:comment,campID:req.params.id});            
                }
            });
        }
    });
   
});

router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
    var ID=req.params.id;
    campground.findById(ID,function(er,camp){
        if(er||!camp){
            req.flash("error","Campground Not Found");                
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,function(er,comment){
                if(er){
                    console.log("eroor");
                }
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    campground.create(camp,function(er,newcamp){
                        if(er){
                            console.log("error");
                        }
                        else{
                            console.log(newcamp);
                            res.redirect("/campgrounds/"+newcamp._id);
                        }
                    });

                    
                }
            });
        }
    });
});

router.put("/campgrounds/:id/comments/:commentId",middleware.checkCommentOwnership,function(req,res){
    var commentId= req.params.commentId;
    campground.findById(ID,function(er,camp){
        if(er||!camp){
            req.flash("error","Campground Not Found");                
            res.redirect("/campgrounds");
        }
        else{
            Comment.findByIdAndUpdate(commentId,{text:req.body.editedComment},function(er,foundComment){
                if(er){
                    console.log(er);
                    res.redirect("/campgrounds");
                }
                else{
                    
                    console.log(foundComment);
                    res.redirect("/campgrounds/"+req.params.id);
                     
                }
            });
        }
    });
});

router.delete("/campgrounds/:id/comments/:commentId",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndDelete(req.params.commentId,function(er){
        if(er){
            console.log(er);
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports=router;
