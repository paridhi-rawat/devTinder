const express = require("express");
const userRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middleware/adminAuth');
const connectionRequestModel = require("../models/connectionRequest");

// get all connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
   try{
      const loggedInUser = req.user
      const connectionRequests = await connectionRequestModel.find({
        toUserId: loggedInUser._id,
        status : 'interested'
      }).populate("fromUserId", "firstName lastName photo skills")
      res.json({
        message : "Data fetched successfully",
        data: connectionRequests
      })

   }catch(err){
      res.status(400).send("something went wrong"+ err.message)
    }
})
module.exports = userRouter;