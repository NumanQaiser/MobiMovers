const express = require("express");
const { checkToken } = require("../Authentication/authmiddleRoutes.js");
// const { sendTokenID } = require("../Authentication/UserAuth");
const { createUser,loginUser,UserImage,UserNotification,Userprofile,updateProfile ,deleteRide,checkUserOtp,showUsers,userRides,userBlock,blockedUser, imageUser} = require("../Controlers/UserActions");
const router = express.Router();


//this is for upload single image
//here we pass the middleware of storing image which the image who has the name is Profile
const single = imageUser.single("Profile");
router.post("/imageOfUser",single,UserImage);

//this route for createing the user into database (SignUP)
router.post("/createUser",createUser);

//this route for login the user
router.post("/login",loginUser);


//this is for sending notification
router.post("/send-notification",UserNotification)

//this is for user profile
//pass the user id
//http://localhost:4000/Assests/Riders/
router.get("/userProfile/:ID",Userprofile);

//this is for update profile
router.put("/updateUserProfile/:ID", updateProfile)

//this is for check the otp of user
router.post("/UserOtp/:ID",checkUserOtp);


//for showing the all users
router.get("/allUsers",showUsers);

//show user rides detail 
//pass the rider id
router.get("/userRides/:ID",userRides);

//this is for delete the book ride
router.get("/deleteRide/:ID",deleteRide);

//for user blockage
router.delete("/userBlockage/:ID",userBlock);

//for show block users
router.get("/blockedUsers",blockedUser);


//for checking the authentication that user is not or valid
router.get("/get-cookie/:id",checkToken, (req,res)=> {
    const identity = req.params.id;


    if(identity)
    {
        res.send("welcome");
        console.log("welcome");
    }
    else
    {
        res.send("This token is not belong to you");
        console.log("This token is not belong to you");
    }

});

module.exports=router;