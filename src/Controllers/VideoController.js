import fs from 'fs'
import usersModel from '../Models/user.js'
import videoModel from '../Models/Video.js'

async function createVideo(req, res) {
    const { title, desc } = JSON.parse(req.body.metadata)
    const creatorId = req.body.userId
    const videoFile = req.files.video[0]
    const thumbnailFile = req.files.thumb[0]

    if (videoFile.mimetype !== 'video/mp4') {
        res.status(403).json({
            error: 'Only mp4 acceptable for video',
            recieved: videoFile.mimetype,
        })
        return
    } else if (
        thumbnailFile.mimetype !== 'image/png' &&
        thumbnailFile.mimetype !== 'image/jpeg'
    ) {
        res.status(403).json({
            error: 'Only jpeg or png acceptable as thumbnail',
            recieved: thumbnailFile.mimetype,
        })
        return
    }

    const video = new videoModel({
        title: title,
        filePath: `uploads/videos/${videoFile.filename}`,
        thumbnail: `uploads/thumbnails/${thumbnailFile.filename}`,
        description: desc,
        creator: creatorId,
    })
    const videoData = await video.save()
    const creator = await usersModel.findById(creatorId)

    creator.videos.push(videoData._id)

    await creator.save()

    res.status(200).json({
        videoId: videoData._id,
    })
}

async function getVideoMetadata(req, res) {
    const videoId = req.params.id
    const video = await videoModel.findById(videoId)

    res.status(200).json({
        title: video.title,
        desc: video.description,
        thumbnail: video.thumbnail,
    })
}

async function getVideo(req, res) {
    const videoId = req.params.id
    const video = await videoModel.findById(videoId)

    const videoPath = video.filePath
    const videoSize = fs.statSync(videoPath).size
    const chuckSize = 10 ** 6 //1Mb

    const range = req.headers.range

    // Parse range

    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + chuckSize, videoSize - 1)

    // Create the headers for sending packet
    const contentLength = end - start + 1

    // increase view if seen till end

    if (end === (videoSize-1)) {
        video.views += 1
        video.save()
    }

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'Video/mp4',
    }

    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
}

async function likeVideo(req,res) {
    const videoId = req.params.id
    const video = await videoModel.findById(videoId)

    const userId = req.body.userId

    if (userId === video.creator){
        res.status(403).json({error: "Can not like or dislike own video"})
        return
    }

    const user = await usersModel.findById(userId)

    const isNotLiked = user.likedVideos.every(id => {
        return id !== videoId
    })

    const isDisliked = user.dislikedVideos.some(id => {
        return id === videoId
    })

    if(isDisliked) {
        video.dislikes -= 1
        user.dislikedVideos.splice(user.dislikedVideos.indexOf(videoId),1)
    }

    if (isNotLiked) {
        video.likes += 1
        user.likedVideos.push(videoId)
    }

    else {
        video.likes -= 1
        user.likedVideos.splice(user.likedVideos.indexOf(videoId),1)
    }

    video.save()
    user.save()
    
    res.sendStatus(200)
}

async function dislikeVideo(req,res) {
    const videoId = req.params.id
    const video = await videoModel.findById(videoId)

    const userId = req.body.userId

    if (userId === video.creator){
        res.status(403).json({error: "Can not like or dislike own video"})
        return
    }

    const user = await usersModel.findById(userId)

    const isNotDisliked = user.dislikedVideos.every(id => {
        return id !== videoId
    })

    const isLiked = user.likedVideos.some(id => {
        return id === videoId
    })

    if(isLiked) {
        video.likes -= 1
        user.likedVideos.splice(user.likedVideos.indexOf(videoId),1)
    }

    if (isNotDisliked) {
        video.dislikes += 1
        user.dislikedVideos.push(videoId)
    }

    else {
        video.dislikes -= 1
        user.dislikedVideos.splice(user.dislikedVideos.indexOf(videoId),1)
    }

    video.save()
    user.save()
    
    res.sendStatus(200)
}

async function deleteVideo(req,res) {
    const userId = req.body.userId
    const videoId = req.params.id

    const video = await videoModel.findById(videoId)

    if (video.creator !== userId) {
        res.status(403).json({error: "Can only delete own video"})
        return
    }

    await videoModel.findByIdAndDelete(videoId)
    fs.rm(video.thumbnail,err=>{
        if(err){console.log(err)}
    })
    fs.rm(video.filePath,err=>{
        if(err){console.log(err)}
    })
    res.sendStatus(200)
}

export { createVideo, getVideoMetadata , getVideo, likeVideo, dislikeVideo,deleteVideo}
