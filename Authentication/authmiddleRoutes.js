
const { sendTokenID } = require("./UserAuth");
const jwt = require("jsonwebtoken")

//here we are creating the token for login user verification
const createToken = (id) => {

    return jwt.sign( { id } , "Food Delievery App" , {
        //one hour time
        expiresIn:1*24*60*60
    });
}

//this function is a middleware for protecting the routes
const checkToken = (req,res,next) => {
    //here we are getting cookie from the browser by doing specific its name
    const token = req.cookies.JWT_Verification;
    if(token)
    {
        jwt.verify(token,"Food Delievery App", (err,decodedToken) => {
            if(err)
            {
                res.send("Token is not valid ");
                console.log("Token is not valid");
            }
            if(decodedToken)
            {
                //this will return you payload like id issued at time and expire time also
                //decodedToken.id
                console.log("Go forward",decodedToken);
                // sendTokenID(decodedToken.id);
                next();
            }
        });

    }
    else
    {
        res.send("You don't have token yet! :)");
        console.log("You don't have token yet! :)")
    }

}

module.exports = {
    createToken,
    checkToken,
}