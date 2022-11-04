import mongoose from "mongoose"

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    filePath: {
        type: String,
        default: "",
    },

    description: {
        type: String,
        default: "",
    },

    thumbnail: {
        type: String,
        default: "",
    },

    likes: {
        type: Number,
        default: 0,
    },
    
    dislikes: {
        type: Number,
        default: 0,
    },
    
    views: {
        type: Number,
        default: 0,
    },

    creator: {
        type: String,
        default: ""
    },
})

const videoModel = mongoose.model("Video",videoSchema)
export default videoModel