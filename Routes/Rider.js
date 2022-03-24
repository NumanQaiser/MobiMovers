const express = require("express");
const { createRider,imageRider,riderLogin,Riderprofile,updateProfile,cancelBookedRide,CompletedRide, historyOfBookedRides,ImageStorage, riderImages , riderPassUpdate, createOTP, checkOTP,showRiderToRides, selectRide } = require("../Controlers/RiderAction");
const {Rider} = require("../Models/Rider/RiderSchema");


const router = express.Router();


//create the rider for signUP
router.post("/createRider",imageRider.single("Profile"), createRider);

//this is a route for login the rider
router.post("/riderLogin",riderLogin);

//this is for rider profile
router.get("/riderProfile/:ID",Riderprofile);

//this is for update profile
router.put("/updateRiderProfile/:ID", updateProfile)

//create riderDetail like taking images from the rider
const upload = ImageStorage.fields([{name:"Profile"},{name:"Card"},{name:"License"}]);
router.post("/riderDetail/:ID",upload,riderImages);
// router.post("/riderDetail/:ID",ImageStorage.single("Profile"),riderImages);


//for update password
router.post("/riderPassUpdate/:EMAIL",riderPassUpdate);

//this route is for create the otp
router.post("/createOTP/:ID",createOTP);


//this route is for check otp
router.post("/checkOTP/:ID",checkOTP);

//check the available ride  for rider convance type
//pass the rider ID
router.get("/available-ride/:ID",showRiderToRides);



//rider wants to book available ride
//here we pass the package id
router.post("/select-ride/:ID",selectRide);

//when rider finished the ride
//here we pass the package id
router.get("/finished-ride/:ID",CompletedRide);

//when rider canceled the book ride
//pass the package id
router.get("/cancel-ride/:ID",cancelBookedRide)

//rider wants to see his all completed rides
//we pass the rider id 
router.get("/allCompletedRides/:ID",historyOfBookedRides);


//for showin all riders
router.get("/showRider",(req,res)=> {
    Rider.find({},(err,data)=>{

        if (err) {
            res.send(err)
        }
        
        if(data)
        {
            res.send(data);
        }
    })
    
})

//testing
router.get("/test",(req,res)=> {
    res.send("testing");
})

module.exports=router;