const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema= new Schema({
    title:{
        type: String,
        required: true,
    },
    description:String,
    image:{
            url:String,
            filename:String,
        //     type:String,
        // default:"/images/default.jpg",
        // set:(v) => v === "" ? "/images/default.jpg": v   //ternary operator  
    },
    price:Number,
    location:String,
    country:String,
    reviews:[            //reviews is an array of ObjectId
        {
        type:Schema.Types.ObjectId,
        ref:"Review"     //Reference to the reviews collection.Review --> Model name
      }
    ],
    owner:{             
        type:Schema.Types.ObjectId,
        ref:"User"     //Reference to the users collection.User --> Model name
    },
    geometry:{
        type:{          //1
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{   //2
            type:[Number],
            required:true
        }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema); 

module.exports=Listing;  //Listing is the name of the model