import express from 'express'
import { validateToken } from '../utils.js'
import { getUserDetail,updateUserDetail } from '../Controllers/UserController.js'

const router = express.Router()

router.get("/:id", getUserDetail)
router.put("/:id", validateToken, updateUserDetail)

export default router
