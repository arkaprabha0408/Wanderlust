if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require('method-override');
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./Models/user.js");
const dbUrl=process.env.ATLASDB_URL;


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
//const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");


// const store=MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:process.env.SECRET
//     },
//     touchAfter:24*3600
// });

// store.on("error",()=>{
//     console.log("ERROR IN MONGO SESSION STORE",err);
// });

const sessionOptions={
    //store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

//Database connection

async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then((res)=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;    //req.user stores the user info if user is logged in.
    //console.log("Current user 2 ---->", req.user);
    next();
});





// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"arka"
//     });

//     let registerdUser=await User.register(fakeUser,"helloworld");
//     res.send(registerdUser);
// });


const listingRouter=require("./Routes/listingRoutes.js");  //requiring listing routes
const reviewRouter=require("./Routes/reviewRoutes.js");  //requiring review routes
const userRouter=require("./Routes/userRoutes.js");  //requiring user routes

//Server
app.listen(8080,()=>{
    console.log("Server started listening ");
});



//-----------------------------------------------------------------------------------------------//

app.use("/listings",listingRouter);  //for listing route
app.use("/listings/:id/reviews",reviewRouter); //for reviews route
app.use("/",userRouter);  //for user route


//Error Handler
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"))
});

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    res.status(status).render("listings/error.ejs",{message});
});


