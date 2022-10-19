import express from 'express'
import mongoose from 'mongoose'

const app = express()
mongoose
    .connect('mongodb://localhost:27017/testwatertube')
    .then(() => {
        console.log('Connected to mongodb')
    })
    .catch((err) => {
        throw err
    })

app.listen(8080, () => {
    console.log('Server started on port 8080')
})
