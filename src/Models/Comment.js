import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },

    creator: {
        type: String,
        default: '',
    },

    video: {
        type: String,
        default: '',
    },
})

const commentModel = mongoose.model('Comment', commentSchema)
export default commentModel
