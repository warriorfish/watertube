import usersModel from '../Models/user.js'
import videoModel from '../Models/Video.js'

async function createVideo(req, res) {
    const { title, desc } = JSON.parse(req.body.metadata)
    const creatorId = req.body.userId
    const videoFile = req.files.video[0]
    const thumbnailFile = req.files.thumb[0]

    if(videoFile.mimetype !== 'video/mp4')
    {
        res.status(403).json({error: "Only mp4 acceptable for video",recieved:videoFile.mimetype})
    }

    else if(thumbnailFile.mimetype !== 'image/png' && thumbnailFile.mimetype !== 'image/jpeg' )
    {
        res.status(403).json({error: "Only jpeg or png acceptable as thumbnail",recieved:thumbnailFile.mimetype})
    }

    const video = new videoModel({
        title: title,
        filePath: videoFile.path.replaceAll("\\","/"),
        thumbnail: thumbnailFile.path.replaceAll("\\","/"),
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

async function getVideoMetadata(req,res) {
    const videoId = req.params.id
    const video = await videoModel.findById(videoId)
    
    res.status(200).json({
        title: video.title,
        desc: video.description,
        thumbnail: video.thumbnail,
    })

}
export { createVideo,getVideoMetadata }
