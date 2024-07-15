const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../Models/review.js");
const Listing=require("../Models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js"); 

const reviewController = require("../Controllers/review.js");

//Reviews Post Route

router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

//Delete Review Route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;