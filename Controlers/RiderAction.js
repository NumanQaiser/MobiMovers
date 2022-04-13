
const { Rider, riderDetial, otpRider } = require("../Models/Rider/RiderSchema");
const path = require("path");
const multer = require("multer");
const nodemailer = require("nodemailer");
const bcryptjs = require("bcryptjs");
const { packageBook } = require("../Models/Package/PackageSchma");
const { img } = require("../Models/Rider/Image");

const storage =  multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"./Assests/Riders/Profiles");
    },
    filename:(req,file,cb) => {
        cb(null,Date.now()+"--"+path.extname(file.originalname));
    }
});

const imageRider = multer({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 1000
    }
});

const  Image = async (req,res) => {

    try {
        const file = req.file.filename;
        // let paths = [];
        // for (var a = 0; a < files?.length;a++) {
        //  paths?.push(files[a]?.path);
        // }
        res.status(200).json({
          success:true,
          data:"/Assests/Riders/Profiles/"+file
        })
      } catch(e) {
        res.status(400).json({
          success:false,
          message:'something went wrong'
        })
      }
    // const i = await img({
    //     RiderImage:req.file.filename
    // })

    // //saving the data into database
    // i.save().then((output) => {
    //     // res.send("user");
    //     res.send(output);
    //     res.send({Response: output, mesage: "Rider  image saved " });

    // }).catch((err) => {
    //     res.send({ Error: err, mesage: "Error in saving Rider image " });
        
    // })

}
const createRider = async (req, res) => {

    
    if (req.body.Password == req.body.Confirm) {
        const r = await Rider({
            Name: req.body.Name,
            Email: req.body.Email,
            Phone: req.body.Phone,
            Password: req.body.Password,
            Confirm: req.body.Confirm,
            Convance: req.body.Convance,
            Image:req.body.filename,
            
        });


        //saving the data into database
        r.save().then((output) => {
            // res.send("user");
            res.send(output);
            console.log("Rider has been created");

        }).catch((err) => {
            res.send({ Error: err, mesage: "Error in saving data into database" });
            console.log("Error in rider creation", err)
        })

    }

    else {
        console.log("Passwod and confirm passowrd are not matched");
        res.send("Passwod and confirm passowrd are not matched");
    }
};

//this is a function for login the rider

var riderLogin = (req, res) => {

    var { Email, Password } = req.body;

    Rider.findOne({ Email: Email }, async (err, data) => {
        if (!data) {
            console.log("Email is not registered");
            res.send("Email is not registered");
        }
        else {

            var match = await bcryptjs.compare(Password, data.Password);
            if (match) {
                //user is authnticate
                if (data.AdminApproved == true) {
                    res.status(201).send({ mesage: "Rider is registered", Response: data });
                    console.log("Rider is registered");
                }
                else {
                    res.status(400).send({ mesage: "Please wait for admin approvel" });
                    console.log("Please wait for admin approvel");
                }

            }
            else {
                //for unauthorized access
                res.status(401).send("Password is wrong");
                console.log("Password is wrong");
            }
        }
        if (err) {
            res.send("Error in Rider login ");
            console.log("Error in Rider login ", err);
        }
    })
}


//here are making storage folder where pics will be store
const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        //first parameter is error is null and second is folder name where file is going to be store
        cb(null, "./Assests/Riders/Approval-Images");
    },
    filename: (req, file, cb) => {
        //first parameter is error is null and second is file name that file had into local system
        cb(null, Date.now() + "--" + path.extname(file.originalname));

    }
});
//here assigning the diskStorage to storage
const ImageStorage = multer({
    storage: storageEngine,
    limits: {
        fileSize: 1024 * 1024 * 1000
    }
});


const riderImages = async (req, res) => {

    // const profile = req.file.filename;
    const profile = req.files.Profile[0].filename;
    const card = req.files.Card[0].filename;
    const license = req.files.License[0].filename;
    
    const id = req.params.ID;
    
    const images = await riderDetial({
        ProfileImage: profile,
        CardImage: card,
        LicenseImage: license,
        riderID: id,
      
    });

    images.save().then(function (data) {
        
        res.send({ DATA: data, message: "Images of rider has been saved" });
    }).catch(err => {
        console.log("Error in imges uploadation of rider");
        res.send({ ERROR: err, message: "Error in imges uploadation of rider" });
    })

};

//for send the otp message
const sendOTP = async (email, otp) => {
    const OTP = String(otp);
    //we are making transport for sedngin the email
    const transport = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,//it's true on this port otherwise false for remaining ports
        secure: true,
        auth: {

            type: "OAUTH2",
            user: 'qaisernuman74@gmail.com',
            clientId: "1070035656335-6v0d6peilqj0i4mgfetiij3tkkn14ptt.apps.googleusercontent.com",
            clientSecret: "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",
            refreshToken: "1//04Sidwq6eLnUoCgYIARAAGAQSNwF-L9IrZbGhEnXm6FEdseB4wSv1ro7sW-jOXDP7vt_kr1WWSwIFOlr3z0mL-DdVBxdF43l7DLc",
            accessToken: "ya29.A0ARrdaM-gseKreSfomiIzECFUnDoRAEnlKuiM-T0zXZ7cWEby7Y3fG0kFbK5Zn9taauVwThT2yZpBTk34f-KSJ8oIVgRC8oYy_XKopYFjViNlZP9H6ktMbmGrfGL6s54ZLMZ-XfXfKRGQz07D0XWzsKkLRwKw",

        }
    })
    //fro send email
    var options = {
        from: "qaisernuman74@gmail.com",
        to: email,
        subject: "Assalam-o-Aliakum",
        //  html: '<h1>Hello, my name is <span id="name"></span></h1><script> let name = "Nathan";document.getElementById("name").innerHTML = "Numan";</script>',
        text: OTP,

    }
    await transport.sendMail(options, function (err, info) {
        if (err) {
            console.log("from Email sending error : ", err);
        }
        else {
            console.log("Email has been send", info.response);

        }
    })

}
//for creating OTP  by Email
const createOTP = (req, res) => {
    const id = req.params.ID;
    console.log(id);
    const Email = req.body.Email;
    const otp = Math.floor(Math.random() * 10000 + 1);
    Rider.findOne({ Email: Email }, async (err, data) => {
        if (data) {
            const saveOTP = await otpRider({
                otpCode: otp,
                riderId: id,
                expireIn: new Date().getTime() + 300 * 1000,
            })
            saveOTP.save().then(data => {
                sendOTP(Email, otp);
                console.log("otp has been generated and saved into database ");
                res.send({ Data: data, message: "otp has been generated and saved into database " });

            }).catch(err => {
                console.log("Error in otp creation");
                res.send({ err: err, message: "error in otp creation" });
            })

        }
        else {
            console.log("Email is not register");
            res.status(404).send("Email is not register");
        }
        if (err) {
            console.log("Erro in rider OTP generation");
            res.send("Erro in rider OTP generation");
        }
    })
}

//check otp
const checkOTP = (req, res) => {
    const id = req.params.ID;
    const otp = req.body.otp;
    const time = new Date().getTime();
    otpRider.findOne({ riderId: id }, (err, data) => {
        if (err) {
            res.send({ Error: err, message: "Opt is not correct" });
        }
        if (data) {

            const chekcExpiry = data.expireIn - time;

            if (chekcExpiry > 0) {
                //
                if (otp == data.otpCode) {
                    //otp is correct updated 204
                    res.status(204).send({ message: "password updated" })
                    console.log("Password updated");
                }
                else {
                    res.status(404).send({ message: "not matched" })
                }
            }
            else {
                //otp expired
                otpRider.findByIdAndDelete(data._id, (err, data) => {
                    if (err) {
                        // res.send({error:err});
                        console.log("Error in update pass saving");
                    }
                    if (data) {
                        // res.send({Data:data});
                        console.log("OTP  expired deleted");
                    }
                })
            }


        }
    })
}

//for update the pass word
const riderPassUpdate = (req, res) => {
    const email = req.params.EMAIL;
    if (req.body.Password == req.body.Confirm) {

        if (req.body.Password.length >= 8) {
            Rider.findOne({ Email: email }, (err, data) => {
                if (err) {
                    res.send({ Error: err });
                    console.log("Eror in password updation");
                }
                if (data) {
                    data.Password = req.body.Password;
                    data.Confirm = req.body.Confirm;
                    res.status(200).send({ DATA: data, message: "Updated pass" });
                    console.log("Password updated successfully");
                    //for saving into database
                    data.save().then((data) => {
                        // res.status(204).send({ mesage: "modified" ,data:data});
                        console.log("modified");
                    }).catch(err => {
                        // res.send({ error: err });
                        console.log(err);
                    })
                }
                else {
                    res.send("Email is not find");
                    console.log("Email is not find")

                }

            })
        }
        else {
            res.send("Password is less than 8 digits");
            console.log("pass is less than 8 digits")
        }

    }
    else {
        console.log("Password and Confirm Password are not matched");
        //not modified 304 error
        res.status(200).send("Pass & Confirm not matched");
    }

}

//this is for showing all available rides to ride veichle type

const showRiderToRides = async (req, res) => {

    try {
        const id = req.params.ID;
        //here we pass the rider id instead of user id
        // because we want to check rider all rides
        const riderAuthnticate = await Rider.findById(id);

        //if rider is not valid then we will go inside this if block
        if (!riderAuthnticate) {
            res.status(400).json({
                success: false,
                Message: 'No rider exists with this ID'
            });
            return
        }
         //if rider is  original then we will go from here
         const AvailableRides = await packageBook.find({veichle:riderAuthnticate.Convance});
         if(!AvailableRides)
         {
            res.status(400).json({
                success: false,
                Message: 'Ride is not Available for this veichle type'
            });
            return
         }
         //for chefcking the available rides 
         var BookedRide = new Array();
         for(let i=0 ;i<AvailableRides.length ;i++)
         {
             if(AvailableRides[i].IsBooked===false)
             {
                 BookedRide[i]=AvailableRides[i];
             }
             
         }
         //here we are cleaning the array that include empty indexs
         const newArray = BookedRide.filter(Boolean);
            res.send({AllAvailablePackage:newArray,message:"These are all Availble  packages according to your veichle type ",Total:newArray.length})
        

    } catch (error) {
        console.log("Error in show available rides to rider", error);
    }
    
}

//by this function rider can choose his rides
const selectRide = async (req,res)=> {
    try {
        const id = req.params.ID;
    //in body you have to pass rider id
    const riderid= req.body.riderID;
    //i'm going to update the package Booking detail
     packageBook.findOne({_id:id}, (err,data) => {

        if(err)
        {
            console.log("This package is not exist Error ",err);
        }

        if(data)
        {
            data.IsBooked=true;
            data.riderID=riderid;
            data.save().then(response=>{
                res.send({Message:"You selected this ride",Data:response})
            }).catch(err=>{
                console.log("Error in select Api catch block ",err);
            })
        }
       
    })
    } catch (error) {
        console.log("Error in select api catch block",err);
        res.send({message:"Error in select api catch block",Error:error});
    }
    
}

//when ride will be completed
const CompletedRide = (req,res) => {
    const id = req.params.ID;
    //i'm going to update the package Booking detail
     packageBook.findOne({_id:id}, (err,data) => {

        if(err)
        {
            res.send({mesage:"This package is not exist Erro",Error:err});
            console.log("This package is not exist Error ",err);
            return;
        }

        if(data)
        {
            //ride has been finished
            data.status=true;
            data.save().then(response=>{
                res.send({Message:"You successfully finished this ride",Data:response})
            }).catch(err=>{
                console.log("Error in finished API Ride ",err);
            })
        }
       
    })
}

//here this function will help to cancel the booked ride
const cancelBookedRide = async(req,res) => {

    //getting package id from the params
    const id = req.params.ID;
   const response =  await packageBook.findByIdAndUpdate(id,{
        riderID:"",
        IsBooked:false
    });
    response.save();
    res.send({Message:"Ride has been canceled",Data:response})
    
}

const Riderprofile = (req, res) => {
    const id = req.params.ID;
    Rider.findOne({ _id: id }, (err, data) => {
        if (err) {
            console.log("Error in user profile API");
            res.send({ ERROR: err, message: "User profile api" });
        }
        if (data) {
            res.send({ Data: data, message: "Data of specific User" });
        }
        if (!data) {
            res.send("User is not registered");
        }
    })
}

const updateProfile = async (req, res) => {
    const id = req.params.ID;
    const salt = await bcryptjs.genSalt();
    //assign the hashing password to password field by this variable
    const hashPass = await bcryptjs.hash(req.body.Password, salt);
    Rider.findById(id, (err, data) => {
        if (err) {
            res.send({ Error: err, Message: "Error in update Profile" });
        }
        if (data) {

            data.Name = req.body.Name,
                data.Email = req.body.Email,
                data.Phone = req.body.Phone,
                data.Password = hashPass,
                Confirm = req.body.Confirm,
                data.save().then(data => { res.send({ Error: data, message: "Rider profile Updated" }) }).catch(err => {
                    res.send({ Error: err, Message: "Error in rider profile updated" })
                })

        }
        if (!data) {
            res.send({ Error: err, Message: "User is not found" })
        }
    })
}

//history of all rider completed rides
const historyOfBookedRides =(req,res)=> {

    const id = req.params.ID;

    packageBook.find({riderID:id},(err,data) => {
        if(err)
        {
            console.log("Error in ALL rider booked rides ",err);
            res.send({Message:"Error in ALL rider booked rides ",Error:err});
        }
        if(data)
        {
            res.send({Message:"ALL rider booked rides ",Response:data,TotalRides:data.length});
        }
    })
}

module.exports = {
    createRider,
    imageRider,
    Image,
    riderLogin,
    createOTP,
    checkOTP,
    riderPassUpdate,
    riderImages,
    ImageStorage,
    showRiderToRides,
    selectRide,
    Riderprofile,
    updateProfile,
    CompletedRide,
    cancelBookedRide,
    historyOfBookedRides
}