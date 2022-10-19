import express from 'express'
import usersModel from '../Models/user.js'
import bcrypt from 'bcrypt'
import {createToken} from '../utils.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
    const { userName, email, password } = req.body
    const encPassword = await bcrypt.hash(password, 10)
    const user = new usersModel({
        userName: userName,
        email: email,
        password: encPassword,
    })
    const userData = await user.save()
    console.log(`Created user successfully with id: ${userData._id}`)

    const webToken = createToken(userData._id);
    res.status(200).json({
        "jwtToken": webToken,
    })
})

export default router
