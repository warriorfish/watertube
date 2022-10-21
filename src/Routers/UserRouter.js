import express from 'express'
import { validateToken } from '../utils.js'
import { deleteUser, getUserDetail,updateUserDetail, updateUserPassword } from '../Controllers/UserController.js'

const router = express.Router()

router.get("/:id", getUserDetail)
router.put("/:id", validateToken, updateUserDetail)
router.put("/:id/update-password",updateUserPassword)
router.delete("/:id",validateToken,deleteUser)

export default router
