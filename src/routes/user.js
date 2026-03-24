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

userRouter.get("/user/connections", userAuth, async (req, res)=>{
  try{
    const loggedInUser = req.user
      const connectionRequests = await connectionRequestModel.find({
        $or : [
            {toUserId: loggedInUser._id, status : 'accepted'},
            {fromUserId: loggedInUser._id, status : 'accepted'}
        ]
      }).populate("fromUserId", "firstName lastName photo skills").populate("toUserId", "firstName lastName photo skills")

      const newdata = connectionRequests.map((row) => {
        if(row.fromUserId.toString() === loggedInUser._id.toString()){
            return row.toUserId
        }
        else return row.fromUserId
        })
      res.json({
        message : "Data fetched successfully",
        data: newdata
      })
  }catch(err){
    res.status(400).send("something went wrong"+ err.message)
  }
})
module.exports = userRouter;