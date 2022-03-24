
const mongoose = require("mongoose");
const sch = mongoose.Schema;
const userBlockSchema = new sch({
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

},
    {
        timestamps:true,
    }
);
const Block = mongoose.model("BlockUsers",userBlockSchema);
module.exports =Block