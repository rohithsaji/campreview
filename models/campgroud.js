var mongoose=require("mongoose");

var campSchema=new mongoose.Schema({
    name: String,
    img: String,
    discription: String,
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }],
    user:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    }
});

module.exports=mongoose.model("campground",campSchema);