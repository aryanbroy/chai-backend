import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const subscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user?._id
    });

    if (subscription) {
        await Subscription.findByIdAndDelete(subscription._id);
        return res.status(200).json(new ApiResponse(200, [], "Unsubscribed successfully"));
    }

    const newSUbscription = await Subscription.create({
        channel: channelId,
        subscriber: req.user?._id,
    })

    return res.status(200).json(new ApiResponse(200, newSUbscription, "Subscribed successfully"));
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    console.log(channelId)

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const channelSubscribers = await Subscription.find({
        channel: channelId
    });

    if (!channelSubscribers) {
        throw new ApiError(404, "Error finding subscribers");
    }

    return res.status(200).json(new ApiResponse(200, channelSubscribers, "Subscribers found successfully"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id");
    }

    const subscribedChannels = await Subscription.find({
        subscriber: subscriberId
    })
    // .select("channel subscriber");

    if (!subscribedChannels) {
        throw new ApiError(404, "Error finding subscribed channels");
    }

    return res.status(200).json(new ApiResponse(200, subscribedChannels, "Subscribed channels found successfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}