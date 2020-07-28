var mongoose=require("mongoose");
var campground=require("./campgroud");
var Comment=require("./comment");

var camps=[
    {
        name:"Camp Yoda",
        img:"https://media-cdn.tripadvisor.com/media/photo-s/13/b8/8a/28/olakira-camp-asilia-africa.jpg",
        discription:"Sky is pretty"
    },
    {
        name:"Camp Yas",
        img:"https://www.exoticamp.com/wp-content/uploads/2018/04/31353834_654595511560142_661742522199941270_n.jpg",
        discription:"Its pretty cold"
    },
    {
        name:"Camp bigfoot",
        img:"https://pix10.agoda.net/hotelImages/6425194/-1/18f40048a640be5daf4c6dd1ff4bf0b6.jpg?s=1024x768",
        discription:"Big foot is present here"
    }
];
var seedDB=function(){
    campground.deleteMany({},function(er){
        if(er){
            console.log("Error");
        }
        else{
            console.log("Campgrounds deleted");
            camps.forEach(function(camp){
                campground.create(camp,function(er,newcamp){
                    if(er){
                        console.log("error");
                    }
                    else{
                        console.log("campAdded");
                        Comment.create({
                            text:"wowowowo",
                            author:"vasu"
                        },function(er,NEW){
                            if(er){
                                console.log("error");
                            }
                            else{
                                console.log("comment added");
                                newcamp.comments.push(NEW);
                                campground.create(newcamp,function(er,NEW){
                                    if(er){
                                        console.log(er);
                                    }
                                });
                            }
                        });
                    }
                })
            });
        }
    });
    
}
module.exports=seedDB;
