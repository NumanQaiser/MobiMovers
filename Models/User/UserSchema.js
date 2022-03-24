const mongo = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongo.Schema;
const User = new Schema({
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        // validate:["Emial must be valid"]

    },
    Phone:{
        type:Number,
        required:true,
        trim:true,
        minlength:10,

    },
    Password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
    },
    Confirm:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
    },
    Image:{
        type:String
    } 

},
    {
        timestamps:true,
    }
);
const client =mongo.model("user",User);

module.exports=client;
