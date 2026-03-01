require("dotenv").config();
const express = require('express');
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express();

app.use(express.json())
app.post("/signup",async (req,res)=>{
  try{
    const email = req.body.email?.toLowerCase?.()?.trim() || req.body.email;
    if (!email) {
      return res.status(400).send("Email is required");
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send("Email already registered");
    }
    const user = new User(req.body);
    await user.save();
    res.send("user added successfully");
  }catch(err){
    if (err.code === 11000) {
      return res.status(400).send("Email already registered");
    }
    res.status(400).send("Validation failed: " + err.message);
  }
});
app.get("/user",async (req,res)=>{
    //const user = new User(req.body.emailId)
    console.log(req.body.emailId)
    try{  
      const user = await User.find({email : req.body.emailId});
      console.log(user)
      if(!user){
        res.status(404).send("user not found")
      }
      res.send(user)
    }catch(err){
      res.status(400).send("something went wrong")
    }
});
app.get("/feed",async (req,res)=>{
    //const user = new User(req.body.emailId)
    try{  
      const user = await User.find({});
      if(!user){
        res.status(404).send("user not found")
      }
      res.send(user)
    }catch(err){
      res.status(400).send("something went wrong")
    }
});
app.delete("/deleteUser",async (req,res)=>{
    try{  
      const user = await User.findByIdAndDelete(req.body.userId);
      res.send("user deleted successfully")
    }catch(err){
      res.status(400).send("something went wrong")
    }
});
app.patch("/updateUser/:userId",async (req,res)=>{
  const userId = req.params.userId;
  const data =  req.body;
  try{
    const isUpdateAllowed = ['gender','age','skills','email'];
    const isUpdated = Object.keys(data).every((k) =>
      isUpdateAllowed.includes(k)
    );
    if(!isUpdated){
      throw new Error("not valid request")
    }
    if(data.skills && data.skills.length > 10){
      throw new Error("skills should be less than 10")
    }
    await User.findByIdAndUpdate(
      userId,
      data,
      { runValidators: true, new: true }
    )
    res.send("user updated successfully")
  }catch(err){
    if (err.code === 11000) {
      return res.status(400).send("Email already registered")
    }
    res.status(400).send("Validation failed: " + err.message)
  }
})

connectDB()
  .then(() => {
    console.log("database connection established...");
    app.listen(3000, () => {
      console.log("server created");
    });
  })
  .catch((err) => {
    console.log("database connection not established...", err.message);
  });

