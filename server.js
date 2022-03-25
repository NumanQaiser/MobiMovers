const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const RiderRoutes = require("./Routes/Rider");
const UserRoutes = require("./Routes/User");
const Rating = require("./Routes/RatingRideRoute") 
const Package = require("./Routes/PackageRoute")
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app=express();
const port =process.env.PORT || 4000;

//mongoDB connection setup
mongoose.connect("mongodb+srv://kingitsol:kingitsol!!22@cluster0.mymqp.mongodb.net/FoodApp?retryWrites=true&w=majority",{
    useNewUrlParser:true,
});
//making sure that setup has been made or not
mongoose.connection.once("open", function(){
    console.log("Mongodb connection has been made.");
})

//middlewares for passing data
app.use(cors());
app.use(bodyParser.urlencoded({extended:true,limit:'5000mb',parameterLimit:1000000}));
app.use(bodyParser.json({extended:true,limit:'5000mb',parameterLimit:1000000}));
app.use(express.json());
//this is a static folder for images
app.use("/Assests", express.static('Assests'));


//routes middlewares
app.use(UserRoutes);
app.use(RiderRoutes);
app.use(Rating);
app.use(Package);

//for parsing he cookie
app.use(cookieParser());

//for saving the image thst's why setting this folder static
app.use(express.static('pics'));
app.use(express.static(path.join(__dirname, "pics")));

//testing routes
app.get("/hello",(req,res)=> {
    res.send("hello world");
})
app.get("/new",(req,res)=>{
res.send("server is running")
})

app.listen(port,()=>{
console.log("server is running",port)
})