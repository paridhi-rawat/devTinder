require("dotenv").config();
const express = require('express');
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express();

app.post("/signup",async (req,res)=>{
    const userObj = {
        firstName : 'Virat',
        lastName :'Kohli',
        email: "kohli@gmail.com",
        password : '12345'
    }
    const user = new User(userObj)
    try{  
      await user.save()
      res.send("user added successfully")
    }catch(err){
      res.status(400).send("something went wrong")
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

