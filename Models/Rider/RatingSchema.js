
//this is a schema for only one ride that we are going to get from user
const mongo = require("mongoose");
const newSche = mongo.Schema;

const RideRating = new newSche({
    userID: {
        type: String,
        required: true
    },
    stars:{
        type: Number,
        required: true
    },
    review:{
        type:String,
        required:true
    },
    rideID:{
        type:String,
        required:true
    },
    riderID:{
        type:String,
        required:true
    }
},
    {
        timestemps: true
    
    }
);

const rideReview = mongo.model("ridesReviews",RideRating);
module.exports=rideReview;