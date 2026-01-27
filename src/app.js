const express = require('express');
const app = express();
const {adminAuth,userAuth} = require('./middleware/adminAuth')
app.use("/admin",adminAuth)
app.get("/admin/getAllAdmin",(req,res)=>{
    res.send("get all user")
})
app.delete("/admin/deleteAllAdmin",(req,res)=>{
    res.send("delete all user")
})
app.get("/user",userAuth,(req,res)=>{
    console.log("get every user")
    res.send("get every user")
})
app.get("/user/login",(req,res)=>{
    console.log("user logged in")
    res.send("user logged in")
})
app.listen(3000,()=>{
console.log("server created")
});
