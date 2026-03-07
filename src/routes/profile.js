const express = require("express");
const profileRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middleware/adminAuth');
const {validateUserEdit} = require("../utils/userValidation")
profileRouter.get("/profile/view",userAuth, async (req,res)=>{
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
profileRouter.patch("/profile/edit",userAuth, async (req,res)=>{
    try{
      if(!validateUserEdit(req)){
        res.status(400).send("invalid edit data")
      }
      const loggedInUser = req.user;
      Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));
      await loggedInUser.save()
      res.json({
        message:'user updated',
        data: loggedInUser
      })
    }catch(err){
      res.status(400).send("something went wrong"+ err.message)
    }
});

module.exports = profileRouter;