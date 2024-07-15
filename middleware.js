const Listing=require("./Models/listing.js");
const Review=require("./Models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

//  1)middleware to check if user is logged in or not.

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //if user is not logged in,he would be sent to login page.
        //Before that,save the redirect Url.It is in req.originalUrl

        req.session.redirectUrl=req.originalUrl;

        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}



//  2)middleware to save redirectUrl to locals.

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

//3)middleware to check if the logged in user is owner or not

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing and don't have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// 4) Middleware to server side validate listing

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body); //we bring out the error from the result returned
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//5) Middleware to server-side validate Reviews

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body); //we bring out the error from the result returned
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//6)middleware to check if the logged in user is author of review or not

module.exports.isReviewAuthor=async (req,res,next)=>{
    let{id,reviewId}=req.params;
    //console.log(reviewId);
    let review=await Review.findById(reviewId).populate("author");
    //console.log("REVIEW----->",review);
    //console.log("Review author:---->", review.author._id);
    //console.log("Current user:---->", res.locals.currUser._id);

    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
