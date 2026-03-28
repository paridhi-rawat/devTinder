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

userRouter.get("/feed",userAuth, async (req, res) =>{

    try{
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const loggedInUser = req.user;
        const connectionRequest = await connectionRequestModel.find({
            $or : [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUser = new Set();
        connectionRequest.forEach((request) => {
            hideUser.add(request.fromUserId.toString());
            hideUser.add(request.toUserId.toString());
        });

        const allUsers = await User.find({
            $and :[
                { _id: {$nin :Array.from(hideUser)}},
                { _id: {$ne : loggedInUser._id}}
            ]
        }).select("firstName lastName photo").skip(skip).limit(limit)
        res.send(allUsers)
    }catch(err){
        res.status(400).json({
            message : err.message
        })

    }
   
})
module.exports = userRouter;