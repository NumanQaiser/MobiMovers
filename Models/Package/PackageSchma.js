
const mongoose = require("mongoose");

const schema = mongoose.Schema;

const rideSchema = new schema({
    pickUpLongitude:{
        type:Number,
        required:true
    },
    pickUpLatitude:{
        type:Number,
        required:true
    },
    dropOffLongitude:{
        type:Number,
        required:true
    },
    dropOffLatitude:{
        type:Number,
        required:true
    },
    userID :{
        type:String,
        required:true
    },
    //package weight that you carry with yourself
    package:{
        type:String,
        required:true
    },
    //car,bike,motor
    veichle :{
        type:String,
        required:true
    },
    //service like juice,etc
    service:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    Km:{
        type:Number,
        required:true
    },
    productNumber:{
        type:Number,
        required:true
    },
    pickUpLocation:{
        type:String,
        required:true

    },
    dropOffLocation:{
        type:String,
        required:true
    },
    riderID:{
        type:String
    },
    status:{
        type:Boolean,
        default:false
    },
    IsBooked:{
        type:Boolean,
        default:false
    }
    
},
    {
        timestamps:true
    }
);

const packageBook = mongoose.model("BookRides",rideSchema);

module.exports = {
    packageBook
}