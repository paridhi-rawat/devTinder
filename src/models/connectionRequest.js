const mongoose = require('mongoose')
const validator = require('validator')
const connectionRequestSchema = new mongoose.Schema(
{
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required:true
    },
    status :{
        type: String,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status',
        },
        required: true,
    }
},
{
    timestamps:true,
})

const connectionRequestModel = mongoose.model("connectionRequest",connectionRequestSchema)
module.exports = connectionRequestModel;
