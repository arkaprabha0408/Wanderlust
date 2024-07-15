//to initialize the data in our database

const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../Models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
.then((res)=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});

//clean all the existing data

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6688fd925200341de581ec0e"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();