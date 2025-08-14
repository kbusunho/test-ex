const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            require:true,
            trim:true
        },
        content:{
            type:String,
            require:true,
        },
        auther:{
            type:String,
            default:"익명"
        }
    },{
        timestamps:true
    }
)


module.exports = mongoose.model("Post", postSchema)