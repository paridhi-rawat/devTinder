const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        validate: {
            validator: (value) => ['male', 'female', 'others'].includes(value),
            message: 'Gender must be one of: male, female, others',
        },
    },
    age:{
        type:Number,
        min : 18,
    },
    photo :{
        type: String,
        default:"https://www.freepik.com/premium-vector/user-icon-icon_323262343.htm",
    }
},
{
    timestamps:true,
})

const User = mongoose.model("User",userSchema)
module.exports = User;
