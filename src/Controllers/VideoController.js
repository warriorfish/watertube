import usersModel from '../Models/user.js'
import videoModel from '../Models/Video.js'

async function createVideo(req, res) {
    const { title, desc } = JSON.parse(req.body.metadata)
    const creatorId = req.body.userId
    const videoFile = req.files.video[0]
    const thumbnailFile = req.files.thumb[0]

    if(videoFile.mimetype !== 'video/mp4')
    {
        res.status(403).json({error: "Only mp4 acceptable for video"})
    }

    else if(thumbnailFile.mimetype !== 'image/png' || thumbnailFile.mimetype !== 'image/jpeg' )
    {
        res.status(403).json({error: "Only jpeg or png acceptable as thumbnail"})
    }

    const video = new videoModel({
        title: title,
        filePath: videoFile.path,
        thumbnail: thumbnailFile.path,
        description: desc,
        creator: creatorId,
    })
    const videoData = await video.save()
    const creator = await usersModel.findById(creatorId)

    creator.videos.push(videoData._id)

    await creator.save()

    res.status(200).json({
        videoId : videoData._id
    })
}

export { createVideo }
