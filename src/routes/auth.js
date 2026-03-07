const express = require("express");
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
authRouter.use(express.json())
authRouter.use(cookieParser())

authRouter.post("/signup",async (req,res)=>{
  try{
   // const email = req.body.email?.toLowerCase?.()?.trim() || req.body.email;
    const {firstName,lastName,email,password} = req.body;
    if (!email) {
      return res.status(400).send("Email is required");
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send("Email already registered");
    }

    // encrypt password
    const passwordHash = await bcrypt.hash(password,10)

    const user = new User({
      firstName,
      lastName,
      email,
      password:passwordHash
    });
    await user.save();
    res.send("user added successfully");
  }catch(err){
    if (err.code === 11000) {
      return res.status(400).send("Email already registered");
    }
    res.status(400).send("Validation failed: " + err.message);
  }
});
authRouter.post("/login",async (req,res)=>{
  try{
   // const email = req.body.email?.toLowerCase?.()?.trim() || req.body.email;
    const {email,password} = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("email not present")
    }

    // encrypt password
    const passwordHash = await bcrypt.compare(password,user.password)
     if (passwordHash) {
      const token = await jwt.sign({_id:user._id},"DevTinder@123");
      res.cookie("token",token)
      res.send("user successfully logged in");
      
    }else{
      throw new Error("password is incorrect")
    }
    
  }catch(err){
    if (err.code === 11000) {
      return res.status(400).send("Email already registered");
    }
    res.status(400).send("Validation failed: " + err.message);
  }
});

authRouter.post("/logout", async (req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("sucessfully logout!!")
});

module.exports = authRouter;