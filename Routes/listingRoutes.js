const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../Models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js"); 
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});  //multer would by default save our files in our clodinary storage

const listingController = require("../Controllers/listing.js");

router.route("/")
        .get(wrapAsync(listingController.index))
        .post(
            isLoggedIn,
            upload.single('listing[image]'),
            validateListing,
            wrapAsync(listingController.createListing));

        //New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
        .get(wrapAsync(listingController.showListing))
        .put(upload.single('listing[image]'),
          validateListing,
          isLoggedIn,
          isOwner,
          wrapAsync(listingController.updateListing))
        .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
        

//Index Route
//router.get("/",wrapAsync(listingController.index));



//Show Route
//router.get("/:id",wrapAsync(listingController.showListing));

//Create Route
//router.post("/",validateListing,isLoggedIn,wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit",      //validateListing is not req in this route as this route would only serve the form.
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

//Update Route
//router.put("/:id",validateListing,isLoggedIn,isOwner,
  //  wrapAsync(listingController.updateListing));

//Delete Route

// router.delete("/:id",isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.destroyListing));

module.exports=router;