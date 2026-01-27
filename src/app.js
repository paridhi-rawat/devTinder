const express = require('express');
const app = express();

app.use("/hello", (req,res)=>{
    res.send("hello hello hello")
})
app.use("/test", (req,res)=>{
    res.send("test1 test1 test1")
})
app.use("/", (req,res)=>{
    res.send("slash slash slash")
})
app.listen(3000,()=>{
console.log("server created")
});
