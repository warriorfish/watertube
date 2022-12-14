import express from 'express'
import bcrypt from 'bcrypt'
import usersModel from '../Models/user.js'

async function getUserDetail(req, res) {
    const userId = req.params.id
    const userData = await usersModel.findById(userId)

    if(!userData) {
        res.status(404).json({
            errorMsg: "user not found"
        })
    }

    res.status(200).json({
        userName    : userData.userName,
        userImg     : userData.userImg,
        subscribers : userData.subscribers,
    })
}

async function updateUserDetail(req,res) {
    const userId = req.params.id
    const {userName,email,userImg} = req.body
    // check if user is authorized to do this
    if (userId !== req.body.userId){
        res.status(403).json({
            errorMsg: "Not authorized"
        })
        return
    }

    await usersModel.findByIdAndUpdate(userId,{
        userName: userName,
        email: email,
        userImg: userImg,
    })

    res.sendStatus(200)
}

async function updateUserPassword(req,res) {
    const userId = req.params.id
    const {oldPassword,newPassword} = req.body
    const user = await usersModel.findById(userId)
    
    // check if user is authorized to do this
    const isValidPassword = await bcrypt.compare(oldPassword,user.password)
    if(!isValidPassword) {
        res.sendStatus(403)
        return
    }

    const encPassword = await bcrypt.hash(newPassword,10)
    
    await usersModel.findByIdAndUpdate(userId,{
        password : encPassword,
    })

    res.sendStatus(200)
}

async function deleteUser(req,res) {
    const userId = req.params.id
    // check if user is authorized to do this
    if (userId !== req.body.userId){
        res.status(403).json({
            errorMsg: "Not authorized"
        })
        return
    }

    await usersModel.findByIdAndDelete(userId)
    res.sendStatus(200)
}

async function alterSubscription(req,res) {
    const channelId = req.params.id
    const userId = req.body.userId

    if (channelId === userId) {
        res.status(403).json({
            errorMsg: "Can not subscribe own channel"
        })
        return
    }

    const channel = await usersModel.findById(channelId)
    const userData = await usersModel.findById(userId)
    const isNotSubscribed = channel.subscribers.every(id => {
        return id !== userId
    })

    if(isNotSubscribed) {
        userData.subscribedChannels.push(channelId)
        channel.subscribers.push(userId)
    }

    else{
        userData.subscribedChannels.splice(userData.subscribedChannels.indexOf(userId),1)
        channel.subscribers.splice(channel.subscribers.indexOf(userId),1)
    }

    await userData.save()
    await channel.save()

    res.sendStatus(200)

}

async function uploadUserIcon(req,res) {
    const userId = req.body.userId
    const channelId = req.params.id

    if(userId !== channelId){
        res.status(403).json({
            error: "Can only update own channel icon"
        })
        return
    }

    const user = await usersModel.findById(userId)

    const icon = req.file

    user.userImg = `uploads/usericons/${icon.filename}`
    await user.save()
    res.sendStatus(200)
}

export {getUserDetail, updateUserDetail, updateUserPassword, deleteUser,alterSubscription, uploadUserIcon}