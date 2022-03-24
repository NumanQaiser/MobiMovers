const mongoose = require("mongoose");

const sche = mongoose.Schema;


const userOtpSchema = new sche({

    userID: {
        type: String,
        required: true
    },
    otpCode: {
        type: Number,
        required: true
    },
    expireIn: {
        type: Number
    }
},
    {
        timestamps: true
    }
);

const UserOtpSchema = mongoose.model("UsersOTPS",userOtpSchema);

module.exports =  UserOtpSchema ;