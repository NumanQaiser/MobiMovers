const rideReview = require("../Models/Rider/RatingSchema");
const { Rider } = require("../Models/Rider/RiderSchema");
const { bookride } = require("../Models/Package/PackageSchma");



const reviewOfRide = async (req,res)=> {
    
        const user_id = req.params.ID;
        const singleRideReview = await rideReview({
            userID:user_id,
            stars:req.body.stars,
            riderID:req.body.riderID,
            review:req.body.review,
            rideID:req.body.rideID
           
        })
        //this is for either ride is existing or not
        //if not then we will return from this function
        singleRideReview.save();
        // boolean flag=false;
        //  await bookride.findOne({_id:req.body.rideID},(err,data)=>{
        //     if(!data) {
        //         res.status(400).json({
        //             success:false,
        //             message:'No appointment exists with the given id'
        //         });
        //         if(err)
        //         {
        //             res.status(400).json({
        //                 success:false,
        //                 message:'No appointment exists with the given id Error'
        //             });
        //         }
        //         // flag=true;
        //         return;
        //      }
        //  }).catch(err=>
        //  {
        //      console.log("Ride is not avialble for rating",err);
        //  } )
        
        
        //now we can get all review of rider by using rider id
        const totalPersonReview = await rideReview.find({riderID:req.body.riderID});
        let sumOfStars =0;
        for (var i = 0; i < totalPersonReview.length; i++) {
            sumOfStars += totalPersonReview[i].stars
        }

        //now we have to find average of each rider 
        const size = totalPersonReview.length
        const averageRating = sumOfStars/totalPersonReview.length;

        //now update the user rating and total reviews
        await Rider.findByIdAndUpdate(req.body.riderID,{
            Rating:averageRating,
            TotalReviews:size,
        });
        console.log(totalPersonReview.length);
        
        res.send({TotalReview:totalPersonReview.length,Size:size})
    //     if(err)
    // {
    //     res.status(400).send({messaage:"Error in giving ride reviews",Error:err});
    // }
    
    


}

module.exports ={
    reviewOfRide
}