import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    // check if user is logged in or not
    // get video id from params
    // check if video id is valid or not
    // check if user has already liked the video or not
    // toggle like

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Log in to like a video");
    }

    const { videoId } = req.params

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const like = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, [], "Like removed successfully"));
    }
    const newLike = await Like.create({
        video: videoId,
        likedBy: userId
    })
    await newLike.save();
    return res.status(200).json(new ApiResponse(200, newLike, "Like added successfully"));

})

const toggleCommentLike = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Log in to like a comment");
    }

    const { commentId } = req.params

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const like = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, [], "Like removed successfully"));
    }

    const newLike = await Like.create({
        comment: commentId,
        likedBy: userId
    })

    await newLike.save();
    return res.status(200).json(new ApiResponse(200, newLike, "Like added successfully"));

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}