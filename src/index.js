import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './Routers/UserRouter.js'
import authRouter from './Routers/authRouter.js'

dotenv.config()

const app = express()
mongoose
    .connect('mongodb://localhost:27017/testwatertube')
    .then(() => {
        console.log('Connected to mongodb')
    })
    .catch((err) => {
        throw err
    })

app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)

app.listen(8080, () => {
    console.log('Server started on port 8080')
})
