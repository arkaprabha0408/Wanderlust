const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../Models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");  //middleware.js has multiple middlewares in 1 file,so {} used to extract each individual middleware

const userController=require("../Controllers/user.js");

router.get("/signup",userController.renderSignupForm);

router.post("/signup",userController.signup);

router.get("/login",userController.renderLoginForm);

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.loginWelcome);

 router.get("/logout",userController.logout);
   

module.exports=router;