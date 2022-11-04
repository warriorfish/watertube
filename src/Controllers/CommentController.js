import videoModel from '../Models/Video.js'
import commentModel from '../Models/Comment.js'

async function addComment(req,res) {
    const {userId,content} = req.body
    const videoId = req.params.videoId
    const video = await videoModel.findById(videoId)

    const newComment = new commentModel({
        content: content,
        creator: userId,
        video: videoId,
    })

    const commentData = await newComment.save()
    video.comments.push(commentData._id)
    await video.save()
    res.status(200).json({commentId: commentData._id})
}

async function updateComment(req,res) {
    const commentId = req.params.id
    const {userId,content} = req.body

    const comment = await commentModel.findById(commentId)
    if (comment.creator !== userId) {
        res.status(403).json({error: "Can only update own comment"})
        return
    }

    comment.content = content
    await comment.save()
    res.sendStatus(200)
}

async function deleteComment(req,res) {
    const commentId = req.params.id
    const userId = req.body.userId

    const comment = await commentModel.findById(commentId)
    
    if(comment.creator !== userId) {
        res.status(403).json({error: "Can only delete own comment"})
        return
    }
    const video = await videoModel.findById(comment.video)
    await commentModel.findByIdAndDelete(commentId)

    video.comments.splice(video.comments.indexOf(commentId),1)

    await video.save()

    res.sendStatus(200)
}

export {addComment,updateComment,deleteComment}