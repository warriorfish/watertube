import express from 'express'
import { addComment, deleteComment, updateComment } from '../Controllers/CommentController.js'
import { validateToken } from '../utils.js'

const router = express.Router()

router.post("/:videoId/",validateToken,addComment)
router.put("/:id/",validateToken,updateComment)
router.delete("/:id/",validateToken,deleteComment)


export default router