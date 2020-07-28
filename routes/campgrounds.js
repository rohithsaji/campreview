var express=require("express");
var router=express.Router();
var campground=require("../models/campgroud");
var methodoverride=require("method-override");
var middleware=require("../middleware");




router.use(methodoverride("_method"));




router.get("/landing",function(req,res){
    res.render("landing.ejs");
});
router.get("/campgrounds",function(req,res){
    campground.find({},function(er,campgrounds){   
        if(er){
            console.log("error");
        }
        else{
            res.render("campgrounds/campgrounds.ejs",{campgrounds: campgrounds});
        }
    });
});
router.get("/campgrounds/add",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/addnew.ejs");
});
router.get("/campgrounds/:id",function(req,res){
    var ID=req.params.id
    campground.findById(ID).populate("comments").exec(function(er,camp)
    {
        if(er||!camp){
            console.log(er);
        }
        else{
            console.log(camp);
              res.render("campgrounds/show.ejs",{camp:camp});      
        }
    });
});
router.get("/campgrounds/:id/edit",middleware.checkCampgrpundOwnership,function(req,res){
    var ID=req.params.id;
    campground.findById(ID,function(er,camp){
        if(er||!camp){
            res.flash("error",er.message);
            res.redirect("/campgrounds");

        }
        else{
            res.render("campgrounds/edit.ejs",{camp:camp});
        }
    });
});


router.post("/campgrounds",middleware.isLoggedIn,function(req,res){

    var camp=req.body.campname;
    var img=req.body.imgurl;
    var dis=req.body.imgdis;
    var newcamp={name :camp, img:img , discription:dis,user:{id:req.user._id,username:req.user.username}};
    

    //console.log("NEWWW USER"+newcamp);

    campground.create(newcamp,function(er,camp){
        if(er){
            console.log("ERROR!");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});
router.put("/campgrounds/:id",middleware.checkCampgrpundOwnership,function(req,res){
    var ID=req.params.id;
    console.log("woowowo"+req.body.campground);
    campground.findByIdAndUpdate(ID,req.body.campground,function(er,camp){
        if(er||!camp){
            console.log(er);
            res.redirect("/campgrounds");
        }
        else{
            console.log(camp);
            res.redirect("/campgrounds/"+ID);
        }
    });
});
router.delete("/campgrounds/:id",middleware.checkCampgrpundOwnership,function(req,res){
    var ID=req.params.id;
    //Comment.findOneAndDelete({author.id:""})
    campground.findOneAndDelete(ID,function(er){
        if(er)
        {
            console.log(er);
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});
 

module.exports=router;


