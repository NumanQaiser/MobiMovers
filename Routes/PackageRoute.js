const express = require("express");
const { packageBooking ,packageHistory } = require("../Controlers/packageContro");
const router = express.Router();

//here we are passing user id for booking package
router.post("/book-package/:ID",packageBooking);

//this is for getting package history
//we also pass here package id
router.get("/package-history/:ID",packageHistory);


module.exports = router;