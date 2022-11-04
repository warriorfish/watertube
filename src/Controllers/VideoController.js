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
    } else if (
        thumbnailFile.mimetype !== 'image/png' &&
        thumbnailFile.mimetype !== 'image/jpeg'
    ) {
        res.status(403).json({
            error: 'Only jpeg or png acceptable as thumbnail',
            recieved: thumbnailFile.mimetype,
        })
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

export { createVideo, getVideoMetadata , getVideo}
