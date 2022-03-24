const mongo = require("mongoose");
const  sche = mongo.Schema;
const notification = new sche({
    clientToken:{
        type:String,
        required:true
    },
    UserID:{
        type:String,
       
    }
}, 
{
    timestamps:true
});

const notify = mongo.model("UserNotifications",notification);

module.exports = notify;