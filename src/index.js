import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import multer from 'multer'
import userRouter from './Routers/UserRouter.js'
import authRouter from './Routers/authRouter.js'
import videoRouter from './Routers/VideoRouter.js'
import CommentRouter from './Routers/CommentRouter.js'

dotenv.config()

const upload = multer({dest: "uploads/"})

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

app.use(morgan('combined'))

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/video',videoRouter)
app.use('/api/comment',CommentRouter)

app.use('/test',upload.single("fileData"),(req,res)=>{
    console.log(JSON.parse(req.body.metadata))
    console.log(req.body.metadata)
    console.log(req.file)
    console.log(`metadata: ${typeof(JSON.parse(req.body.metadata))} filedata:${typeof(req.file)}`)
    res.sendStatus(200)
})

app.listen(8080, () => {
    console.log('Server started on port 8080')
})
