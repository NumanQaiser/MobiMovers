const { packageBook } = require("../Models/Package/PackageSchma");



//we are calculating distance
function distanceCalculate(lati1, lati2, longi1, longi2) {

    //convert it into radians
    const longitude1 = longi1 * Math.PI / 180;
    const longitude2 = longi2 * Math.PI / 180;
    const latitude1 = lati1 * Math.PI / 180;
    const latitude2 = lati2 * Math.PI / 180;

    //using Haversine formula
    const d_Longitude = longitude2 - longitude1;
    const d_Latitude = latitude2 - latitude1;

    // putting distance longitude and latitude into equation
    const calculate = Math.pow(Math.sin(d_Latitude / 2), 2) + Math.cos(lati1) * Math.cos(lati2) * Math.pow(Math.sin(d_Longitude / 2), 2);

    //for converting into km 6371
    const v = 2 * Math.asin(Math.sqrt(calculate));
    const km = v * 6371;
    return km;
}


//this is route for booking the ride 
var packageBooking = async (req, res) => {

    const longitude1 = req.body.pickUpLongitude;
    const longitude2 = req.body.dropOffLongitude;
    const latitude1 = req.body.pickUpLatitude;
    const latitude2 = req.body.dropOffLatitude;
    const packageSize = req.body.PackageSize;
    const veichleSize = req.body.VeichleType;
    const serviceSize = req.body.ServiceType
    const pickUpName = req.body.pickUpLocation;
    const dropOffName = req.body.dropOffLocation;

    var package, veichle, service;
    let price;

    //invoking function for calculate distance
    const km = distanceCalculate(latitude1, latitude2, longitude1, longitude2);


    const packageTypes = ["S", "M", "L", "XL"];
    const veichleTypes = ["Walk", "Bike", "Car", "PickUp", "Truck"];
    const serviceTypes = ["S1", "S2", "S3", "S4"];
    //invoking function for package type
    packageTypes.forEach((value, index, array) => {
        if (value == packageSize) {
            package = value;
            if (index == 0) {

                const fair = 5;
                price = fair
            }
            else if (index == 1) {
                const fair = 10;
                price = fair
            }
            else if (index == 2) {
                const fair = 20;
                price = fair
            }
            else if (index == 3) {
                const fair = 30;
                price = fair
            }
        }
    }
    );
    //invoking function for veichle type
    veichleTypes.forEach((value, index, array) => {
        if (value == veichleSize) {
            veichle = value;
            if (index == 0) {

                const fair = 10;
                price += fair
            }
            else if (index == 1) {
                const fair = 20;
                price += fair
            }
            else if (index == 2) {
                const fair = 30;
                price += fair
            }
            else if (index == 3) {
                const fair = 40;
                price += fair
            }
            else if (index == 4) {
                const fair = 50;
                price += fair
            }
        }
    }
    );
    //invoking function for service type
    serviceTypes.forEach((value, index, array) => {
        if (value == serviceSize) {
            service = value;
            if (index == 0) {

                const fair = 5;
                price += fair
            }
            else if (index == 1) {
                const fair = 10;
                price += fair
            }
            else if (index == 2) {
                const fair = 15;
                price += fair
            }
            else if (index == 3) {
                const fair = 20;
                price += fair
            }

        }
    }
    );
    let distance;
    distance = km * 1.45;
    price = price + distance;
    price = Math.floor(price);
    const parcelNo = Math.floor(Math.random() * 10000 + 1);

    const id = req.params.ID;

    var rideData = await packageBook({

        userID: id,
        pickUpLongitude: longitude1,
        pickUpLatitude: latitude1,
        dropOffLongitude: longitude2,
        dropOffLatitude: latitude2,
        package: package,
        veichle: veichle,
        service: service,
        price: price,
        pickUpLocation: pickUpName,
        dropOffLocation: dropOffName,
        productNumber: parcelNo,
        Km: Math.floor(km)
    });

    rideData.save().then((data) => {
        console.log("Package has been book and saved");
        res.send({ message: "package has been book and saved", Data: data });
    }).catch(function (err) {
        console.log("Package is not created", err);
        res.send({ message: "Package is not Created", Error: err });
    });
}
//this is for specific history of package
//that rider and  user can check
const packageHistory = async (req,res) => {
    const id = req.params.ID;
     packageBook.findById(id,(err,data) => {
         if(err)
         {
             console.log("Error in package history",err);
             res.send("Error in package history");
         }
         if(data)
         {
             res.send({message:"history of your package",Response:data});

         }
     })
}

module.exports ={
    packageBooking,
    packageHistory
}