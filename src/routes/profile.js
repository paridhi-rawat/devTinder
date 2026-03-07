const express = require("express");
const profileRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middleware/adminAuth');

profileRouter.get("/profile",userAuth, async (req,res)=>{
    try{
      const user = req.user;
      if(!user){
        res.status(404).send("user not found")
      }
      res.send(user)
    }catch(err){
      res.status(400).send("something went wrong")
    }
});

module.exports = profileRouter;