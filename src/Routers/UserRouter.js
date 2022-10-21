import express from 'express'
import { validateToken } from '../utils.js'
import { getUserDetail } from '../Controllers/UserController.js'

const router = express.Router()

router.get("/:id", getUserDetail)

export default router
