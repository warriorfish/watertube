import express from 'express'
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
    const {userName,password,email,userImg} = req.body
    // check if user is authorized to do this
    if (userId !== req.body.userId){
        res.status(403).json({
            errorMsg: "Not authorized"
        })
        return
    }

    await usersModel.findByIdAndUpdate(userId,{
        userName: userName,
        password: password,
        email: email,
        userImg: userImg,
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

export {getUserDetail, updateUserDetail, deleteUser}