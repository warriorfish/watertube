import express from 'express'
import multer from 'multer'
import { uuid } from 'uuidv4'
import { createVideo, getVideo, getVideoMetadata, likeVideo, dislikeVideo} from '../Controllers/VideoController.js'
import { validateToken} from '../utils.js'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        {
            cb(null,'uploads/thumbnails/')
        }
        else if(file.mimetype === 'video/mp4')
        {
            cb(null,'uploads/videos/')
        }
      },
    filename: function (req, file, cb) {
        if(file.mimetype === 'video/mp4')
        {
            cb(null, uuid() + '.mp4') //Appending extension
        }
        else if(file.mimetype === 'image/png')
        {
            cb(null, uuid() + '.png')
        }
        else if(file.mimetype === 'image/jpeg')
        {
            cb(null, uuid() + '.jpeg')
        }
    }
})

const uploadHandler = multer(
    { 
        storage: storage , 
        limits: {fieldSize: 1*1024*1024*1024}, // 1GB
        fileFilter: function(req,file,cb) {
            const mimetype = file.mimetype
            if(mimetype === 'video/mp4' || mimetype === 'image/png' || mimetype === 'image/jpeg')
            {
                cb(null,true)
            }
            else
            {
                cb(null,false)
            }
        }
    })
const router = express.Router()

router.post('/', uploadHandler.fields([
    {name: 'video', maxCount: 1,},
    {name: 'thumb', maxCount: 1,},
]), validateToken, createVideo)

router.get('/:id',getVideoMetadata)

router.get('/:id/videoData/',getVideo)

router.post('/:id/like',validateToken,likeVideo)

router.post('/:id/dislike',validateToken,dislikeVideo)

export default router
