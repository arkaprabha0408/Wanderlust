const Listing=require("../Models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geoCodingClient=mbxGeocoding({ accessToken:mapToken});

module.exports.index=async(req,res,next)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});    
    }



module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};




module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({                 //nested populate.author inside reviews.
        path:"reviews",
        populate:{path:"author"}
    })   
    .populate("owner");  
    //console.log(JSON.stringify(listing, null, 2));
    //reviews and owner are keys in the Listing schema
    
    //listing-->contains all the details of the listing extracted from the database
    
    if(!listing){
        req.flash("error","The Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};



module.exports.createListing=async(req,res,next)=>{

    //Forward GeoCoding

    let response=await geoCodingClient.forwardGeocode({  //forwardGeocode is a function which changes location to coordinates
        query:req.body.listing.location,
        limit: 1
      })
        .send()

    let url=req.file.path;
    let filename=req.file.filename;
    let listing=req.body.listing; //listing-->object & it contains the key value pairs
const newListing=new Listing(listing);   //Listing --> model name 
newListing.owner=req.user._id;   //the id of currently logged in user is saved in owner.
//owner ---> holds the object id of the owner in listing schema
newListing.image={url,filename};
newListing.geometry=response.body.features[0].geometry;
let finalListing=await newListing.save();
console.log(finalListing);
req.flash("success","New Listing created!");
res.redirect("/listings")
};



module.exports.renderEditForm=async (req,res,next)=>{
    //console.log(req.params.id);
    let {id}=req.params;
    //console.log(Listing.findById(id));
    const listing=await Listing.findById(id);
    if(!listing){
       req.flash("error","The Listing you requested for does not exist !");
       res.redirect("/listings");
   }
   let originalImageUrl=listing.image.url;
   let copyImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_250");
    res.render("listings/edit.ejs",{listing,copyImageUrl});
};



module.exports.updateListing=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    //this part is only for updating the image
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};



module.exports.destroyListing=async(req,res,next)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    //console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};