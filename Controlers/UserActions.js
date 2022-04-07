const User = require("../Models/User/UserSchema");
const bcrypt = require("bcryptjs");
const { createToken } = require("../Authentication/authmiddleRoutes.js");
const { packageBook } = require("../Models/Package/PackageSchma");
const UserOtpSchema = require("../Models/User/UserOtp");
const nodemailer = require("nodemailer");
const Block = require("../Models/User/BlockUser");
const {admin} = require("../Configuration/Firebase");
const multer = require("multer");
const path = require("path");


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
            refreshToken: "1//047AnLEXd2HDjCgYIARAAGAQSNwF-L9Irwtcn1tikW7GNivXSIM3iX6h7EHn2PmdurA4uEW-HuAyP07nZT5NjtCZORA0wKYDOCnQ",
            accessToken: "ya29.A0ARrdaM9c8hxkBFiaaRix_qKScPJT1sAhWKTVCKXizuUp2cbY43TDQAI3wwfI362m307KhEHwpnqAiEBWtJbNAtGyD4nTnZV5jKO3a0t4FtWW79HbMccfYE_3_2dmhrn2EjBdf_pPRad8GBA7CCykmDYp0ftd",

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

const storage =  multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"./Assests/Users");
    },
    filename:(req,file,cb) => {
        cb(null,Date.now()+"--"+path.extname(file.originalname));
    }
});

const imageUser = multer({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 1000
    }
});


const  UserImage = async (req,res) => {

    try {
        const file = req.file.filename;
     
        res.status(200).json({
          success:true,
          data:"/Assests/Users/"+file
        })
      } catch(e) {
        res.status(400).json({
          success:false,
          message:'something went wrong'
        })
      }

}

//for creatin user mean for signUP page
const createUser = async (req, res) => {
  
    var salt = await bcrypt.genSalt(10);
    var hashPass = await bcrypt.hash(req.body.Password, salt);
    // const imageFile= req.file.filename;
    //calling model form schema
    const user = await User({
        Name: req.body.Name,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Password: hashPass,
        Confirm: req.body.Confirm,
        Image:req.file.filename
    });
    
    //saving all data into database
    if (req.body.Password == req.body.Confirm) {

        user.save().then(async (data) => {
            // creating the random number
            const otp = Math.floor(Math.random() * 10000 + 1);
            if (otp < 999) {
                otp = Math.floor(Math.random() * 10000 + 1);
            }
            //for sending the Email 
            sendOTP(req.body.Email, otp);
            const saveOTP = await UserOtpSchema({
                otpCode: otp,
                userID: data._id,
                expireIn: new Date().getTime() + 300 * 1000,
            })
            saveOTP.save().then((response) => {

                res.send({ Data: response, message: "Data has been saved of user and otp . " });

            }).catch(err => {
                console.log("Error in sending user otp :", err);
                res.send({ Error: err, message: "Error in sending user otp" });
            })

        }).catch(err => {
            console.log("Error in saving user data :", err);
            res.send({ ERROR: err, message: "User data saving error" });
        })

    }

    else {
        res.send("password and confirm password are not match")
        console.log("password and confirm password are not match");
    }


}

// here we do the code of check the user otp that generated at the time of singnup
const checkUserOtp = (req, res) => {
    const id = req.params.ID;
    const otp = req.body.Otp;
    UserOtpSchema.findOne({ userID: id }, (err, data) => {
        if (data) {
            if (data.otpCode == otp) {
                //and also delete the otp form database after verify
                UserOtpSchema.findByIdAndDelete({ _id: data._id }, (err, info) => {
                    if (err) {
                        res.send("user otp can not be deleted");
                    }
                    if (info) {
                        res.send({ message: "Your otp is right", Data: info });
                        console.log("Your otp is right");
                    }
                })

            }
            else {
                res.send({ message: "Otp Code is wrong" })
                console.log("Otp is wrong");
            }
        }
        if (err) {
            res.send({ Error: err, message: "Error in otp check of user" });
        }
    })
}

//for checking user logIn for logIN page
const loginUser = (req, res) => {
    const { Password, Email } = req.body;
    console.log(Email);
    //finding the user into database through email
    User.findOne({ Email: Email }, async (err, data) => {
        if (data) {
            //decode the password whic we hashed at the time of saving in database
            const match = await bcrypt.compare(Password, data.Password);

            if (match) {
                //here we create the token every time when user is login
                const token = createToken(data._id);
                res.cookie("JWT_Verification", token);
                res.send({Message:"User is register",Response: data});
                console.log("user is register");
            }
            else {
                res.send("Password is wrong");
                console.log("password is wrong");
            }
        }
        else {
            res.send("User is not authentic");
            console.log("Email is wrong");
        }
        if (err) {
            res.send("Error in user login functionality");
            console.log("Error in user login functionality");
        }
    });
}

//this is for showing the all users 
const showUsers = (req, res) => {

    User.find({}, (err, data) => {
        if (err) {
            console.log("Error in getting the all users");
        }
        if (data) {
            res.send(data);
            console.log("ALL USERS");
        }
    })
}


const userRides = (req, res) => {
    const id = req.params.ID;
    packageBook.find({ userID: id }, (err, data) => {
        if (err) {
            console.log("Error in userRides handeler");
            res.send({ ERROR: err, message: "Error in user rides handeler" });
        }
        if (data) {
            res.send({ Data: data, message: "user rides details" });
            
        }
        if (!data) {
            res.send({ Message: "Sorry you did not book any rides yet" })
        }
    })
}

const userBlock = (req, res) => {
    const id = req.params.ID;
    User.findByIdAndDelete({ _id: id }, async (err, data) => {
        if (err) {
            res.send({ ERROR: err, message: "Error in user Blockage" });
        }
        if (data) {
            const blockData = await Block({
                Name: data.Name,
                Email: data.Email,
                Phone: data.Phone,
                Password: data.Password,
                Confirm: data.Confirm,

            });
            blockData.save().then((data) => {
                res.send({ Data: data, message: "User Block successfully" });
                console.log("User Block successfully");
            }).catch(err => {
                console.log("Error in user blockage and saving", err);
                res.send({ Error: err, message: "User Block Error" })
            })

        }
    })
}

const blockedUser = (req, res) => {

    Block.find({}, (err, data) => {
        if (err) {
            console.log("Error in getting blocked user", err);
            res.send({ ERROR: err, message: "Error in getting blocked user" });
        }
        if (data) {
            res.send({ message: "All block user", Data: data });
            console.log("All blocked user");
        }
    })
}

const deleteRide = (req, res) => {
    const id = req.params.ID;

    packageBook.findOneAndDelete({ _id: id }, (err, data) => {
        if (err) {
            console.log("Error in userRides handeler");
            res.send({ ERROR: err, message: "Error in user rides handeler" });
        }
        if (data) {
            res.send({ Data: data, message: "user ride deteted" });
            console.log("User Ride Deleted");
        }
        if (!data) {
            res.send({ Message: "Sorry you did not book any rides with this id" })
        }
    })

}

const Userprofile = (req, res) => {
    const id = req.params.ID;
    User.findOne({ _id: id }, (err, data) => {
        if (err) {
            console.log("Error in user profile API");
            res.send({ ERROR: err, message: "Error User profile api" });
        }
        if (data) {
            res.send({ Data: data, message: "Data of specific User" });
        }
        if (!data) {
            res.send("User is not registered");
        }
    })
}

const updateProfile =async  (req, res) => {
    const id = req.params.ID;
    const salt =  await bcrypt.genSalt();
    //assign the hashing password to password field by this variable
    const hashPass = await  bcrypt.hash(req.body.Password, salt);
    User.findById(id, (err, data) => {
        if (err) {
            res.send({ Error: err, Message: "Error in update Profile" });
        }
        if (data) {

            data.Name= req.body.Name,
            data.Email= req.body.Email,
            data.Phone= req.body.Phone,
            data.Password= hashPass,
            Confirm = req.body.Confirm,
            data.save().then(data=> {res.send({Error:data,message:"User profile Updated"})}).catch(err=>{
                res.send({ Error: err, Message: "Error in user profile updated" })
            })
                                
        }
        if(!data)
        {
            res.send({ Error: err, Message: "User is not found" })
        }
    })
}



const UserNotification = (req,res) => {
    const  registrationToken = req.body.Token
    const message = req.body.message;
    
    var payload = {
        data:{
            Title:message,
            
        }
    }
    const options = {
      priority: "high",
      timeToLive: 60*60*24
    };
    
      admin.messaging().sendToDevice(registrationToken, payload, options)
      .then( response => {
       res.status(200).send({Mesage:"Notificatin has been send",Response:response})
       
      })
      .catch( error => {
         
          res.send({message:"Error in send notification api",Error:error});
      });
  }

module.exports = {
    createUser,
    imageUser,
    loginUser,
    showUsers,
    checkUserOtp,
    packageBook,
    userRides,
    userBlock,
    blockedUser,
    deleteRide,
    Userprofile,
    updateProfile,
    UserNotification,
    UserImage
   
}
