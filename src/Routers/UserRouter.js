import express from 'express'
import multer from 'multer'
import {uuid} from 'uuidv4'
import { validateToken } from '../utils.js'
import { alterSubscription, deleteUser, getUserDetail,updateUserDetail, updateUserPassword, uploadUserIcon } from '../Controllers/UserController.js'

const router = express.Router()

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'uploads/usericons/')
    },
    filename: function(req,file,cb){
        if(file.mimetype === 'image/png')
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
        limits: {fieldSize: 1*1024*1024}, // 1mb
        fileFilter: function(req,file,cb) {
            const mimetype = file.mimetype
            if(mimetype === 'image/png' || mimetype === 'image/jpeg')
            {
                cb(null,true)
            }
            else
            {
                cb(null,false)
            }
        }
    })

router.get("/:id", getUserDetail)
router.put("/:id", validateToken, updateUserDetail)
router.put("/:id/update-password",updateUserPassword)
router.delete("/:id",validateToken,deleteUser)
router.post("/:id/subscribe",validateToken,alterSubscription)
router.put("/:id/avatar",uploadHandler.single("avatar"), validateToken,uploadUserIcon)
export default router
