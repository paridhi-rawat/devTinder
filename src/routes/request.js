const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user")
const { userAuth } = require('../middleware/adminAuth');
const mongoose = require("mongoose")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ['ignored', 'interested'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "status is not allowed"
      });
    }


    const toUser = await User.findById(toUserId);
    if(!toUser){
         return res.status(400).send("user not exist");
    }
    console.log(toUserId,fromUserId)
    const isSelf = new mongoose.Types.ObjectId(toUserId).equals(req.user._id);
    if(isSelf){
        return res.status(400).send("Cannot send request to itself");
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId },
            {fromUserId:toUserId, toUserId:fromUserId},
        ]
    })
    if(existingConnectionRequest){
        return res.status(400).send("Connection request already exist");
    }
    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
        });
        const data = await connectionRequest.save()
        res.json({
            message : "Connection request send successfully",
            data
        });
   
  } catch (err) {
      console.error(err);
      const message = err.message || "something went wrong";
      res.status(400).json({ error: message });
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const {status,requestId} = req.params;
        const loggedInUser = req.user
        //validate status
        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "status is not allowed"
        });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status: 'Interested'
        })
        if(!connectionRequest){
             res.status(404)
            .json({
            message: "connection not found"
        });

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message : "Connection request"+ status,
            data
        });
        }

    }catch(e){
      const message = err.message || "something went wrong";
      res.status(400).json({ error: message });
    }
});    
module.exports = requestRouter;