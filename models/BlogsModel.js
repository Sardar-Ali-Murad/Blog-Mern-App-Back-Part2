import mongoose from "mongoose";

let BlogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Provise the title please"]
    },
    summary:{
        type:String,
        required:[true,"Provise the summary please"]
    },
    description:{
        type:String,
        required:[true,"Provise the title please"]
    },
    image:{
        type:String,
        required:[true,"Please Provide the image"]
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"BlogAppUsers"
    },
    votes:[{type:mongoose.Types.ObjectId,ref:"BlogAppUsers"}]
},{timestamps:true})

export default mongoose.model("BlogsAppBlogs",BlogSchema)