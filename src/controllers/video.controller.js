import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Please provide title and description");
    }
    // TODO: get video, upload to cloudinary, create video
    // console.log(title, description)
    // get username from req.user
    // get video from req.files
    // get thumbnail from req.files
    // upload video and thumbnail to cloudinary
    // get video and thumbnail url from cloudinary
    // store the video and thumbnail url in the database
    // add title and description to the database
    // add the user's id to the owner field

    const userId = req.user._id;


    if (!userId) {
        throw new ApiError(400, "You need to be logged in to publish a video");
    }

    const videoPath = req.files?.videoFile[0].path;

    const thumbnailPath = req.files?.thumbnail[0].path;

    // console.log(username, videoPath, thumbnailPath)

    if (!videoPath || !thumbnailPath) {
        throw new ApiError(400, "Please upload video and thumbnail");
    }

    const videoFile = await uploadOnCloudinary(videoPath);
    const thumbnail = await uploadOnCloudinary(thumbnailPath);

    // below code is to convert duration from seconds format to standard hr:min:sec format

    // console.log(videoFile)
    // const duration = videoFile.duration;
    // const hour = Math.floor(duration / 3600);
    // const minute = Math.floor((duration % 3600) / 60);
    // const seconds = Math.floor((duration % 3600) % 60);

    // const durationInStandardForm = `${hour}hr ${minute}min ${seconds}sec`

    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "Something went wrong while uploading video and thumbnail");
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: userId,
        title,
        description,
        duration: videoFile.duration,
        views: 0,
        isPublished: true
    })

    return res.status(200).json(new ApiResponse(200, video, "Video uploaded successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
