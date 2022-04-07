
const mongo = require("mongoose");
const sche = mongo.Schema;

const image = new sche({
    RiderImage:{
        type:String,
        required:true
    }
});

const img = mongo.model("RiderProfiles",image);

module.exports ={
    img
}
