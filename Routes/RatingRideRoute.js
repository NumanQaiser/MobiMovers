

const express = require("express");
const { reviewOfRide } = require("../Controlers/RideRating");
const router = express.Router();

//this is route for user to post reviews about specific ride
//we pass user id as a params
router.post("/rideReview/:ID",reviewOfRide);

module.exports =router