import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,

        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    userImg: {
        type: String,
        default: "",
    },

    subscribers: {
        type: [String],
        default: [],
    },

    subscribedChannels: {
        type: [String],
        default: [],
    },
})

const usersModel = mongoose.model('User', userSchema)
export default usersModel
