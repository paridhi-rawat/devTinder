const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const isAuthenticated = token === 'xyz';
    console.log("admin authentication")
    if(!isAuthenticated){
        res.status(401).send("user not authenticated")
    }else {
        next()
    }
};
const userAuth = (req,res,next)=>{
    const token = "xyz";
    const isAuthenticated = token === 'xyz';
    console.log("user authentication")
    if(!isAuthenticated){
        res.status(401).send("user not authenticated")
    }else {
        next()
    }
}
module.exports={
    adminAuth,userAuth
}