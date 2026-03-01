require("dotenv").config();
const express = require('express');
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express();

app.use(express.json())
app.post("/signup",async (req,res)=>{
    const user = new User(req.body)
    try{
      await user.save()
      res.send("user added successfully")
    }catch(err){
      if (err.code === 11000) {
        return res.status(400).send("Email already registered")
      }
      res.status(400).send("Validation failed: " + err.message)
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
app.patch("/updateUser",async (req,res)=>{
    try{
      await User.findByIdAndUpdate(
        req.body.userId,
        req.body,
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

