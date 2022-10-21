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

export {getUserDetail}