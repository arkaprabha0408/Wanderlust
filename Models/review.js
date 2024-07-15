const mongoose=require("mongoose");
const Schema=mongoose.Schema;

//Create the schema
const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()   //by default the current date would be set
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",          //Reference to the users collection. User ---> Model name.
    }
});

//Create the Model
const Review=mongoose.model("Review",reviewSchema);

module.exports=Review;