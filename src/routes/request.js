const express = require("express");
const requestRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middleware/adminAuth');


requestRouter.post("/sendConnectionRequest",userAuth, async (req,res)=>{
    try{
      const user = req.user;
      res.send(user.firstName + ' send connection request')
    }catch(err){
      res.status(400).send("something went wrong")
    }
});
module.exports = requestRouter;