const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const userAuth = async (req,res,next)=>{
    try{  
      const cookie = req.cookies;
      const {token} = cookie;
      if(!token){
        throw new Error("token not found")
      }
      const decodedToken = await jwt.verify(token,"DevTinder@123")
      const {_id} = decodedToken;

      const user = await User.findById(_id);
      if(!user){
        throw new Error("user not found")
      }
      req.user = user;
      next();
    }catch(err){
      res.status(400).send("User not valid")
    }
   
}
module.exports={
    userAuth
}