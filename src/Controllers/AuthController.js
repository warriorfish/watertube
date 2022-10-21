import usersModel from '../Models/user.js'
import bcrypt from 'bcrypt'
import {createToken} from '../utils.js'

const signup = async (req, res) => {
    const { userName, email, password } = req.body
    const encPassword = await bcrypt.hash(password, 10)
    const user = new usersModel({
        userName: userName,
        email: email,
        password: encPassword,
    })
    const userData = await user.save()

    const webToken = createToken(userData._id);
    res.status(200).json({
        "jwtToken": webToken,
    })
};

const signin = async (req, res) => {
    const { userName, password } = req.body

    const user = await usersModel.findOne({userName: userName})

    if(!user){
        res.status(401).json({
            "errorMsg":"Invalid username or password"
        })
        return
    }

    const isValidPassword = await bcrypt.compare(password,user.password)
    if (!isValidPassword){
        res.status(401).json({
            "errorMsg":"Invalid username or password"
        })
        return
    }

    const webToken = createToken(user._id);
    res.status(200).json({
        "jwtToken": webToken,
    })
};

export {signup,signin};