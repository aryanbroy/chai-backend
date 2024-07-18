import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"

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

    return res.status(200).json(new ApiResponse(200, newLike, "Like added successfully"));

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Log in to like a tweet");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const like = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, [], "Like removed successfully"));
    }

    const newLike = await Like.create({
        tweet: tweetId,
        likedBy: userId
    })

    return res.status(200).json(new ApiResponse(200, newLike, "Like added successfully"));
}
)

// Not completed
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Log in to get liked videos");
    }

    const likes = await Like.find({ likedBy: userId });

    const videoIds = likes.map(like => like.video);

    const videos = await Video.find({ _id: { $in: videoIds } });
    return res.status(200).json(new ApiResponse(200, videos, "Videos found successfully"));

});

export const getLikesOfVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const likes = await Like.countDocuments({ video: videoId });

    return res.status(200).json(new ApiResponse(200, likes, "Likes found successfully"));
})

export const getLikesOfTweets = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    const likes = await Like.countDocuments({ tweet: tweetId });

    return res.status(200).json(new ApiResponse(200, likes, "Likes found successfully"))
})

export const getLikedTweets = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Log in to get liked tweets");
    }

    const tweetsLiked = await Like.find({ tweet: { $exists: true }, likedBy: userId });

    return res.status(200).json(new ApiResponse(200, tweetsLiked, "Tweets found successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}