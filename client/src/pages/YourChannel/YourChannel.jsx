import React, { useEffect, useState } from 'react'
import styles from './YourChannel.module.css'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { ColorRing } from 'react-loader-spinner';
import { FaPlay } from 'react-icons/fa';
import useFormatDate from '../../hooks/useFormatDate';
import Tweet from '../../components/Tweet/Tweet';

export default function YourChannel() {
    const [isOwner, setIsOwner] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const { channelId } = useParams();
    const [channelDetails, setChannelDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [buttonSelected, setButtonSelected] = useState("video");
    const [channelVideos, setChannelVideos] = useState(null);
    const [subscribers, setSubscribers] = useState(null)
    const [subscribedTo, setSubscribedTo] = useState(null);
    const [subscriptionStatus, setSubscriptionStatus] = useState({});

    const handleButtonClick = (e) => {
        setButtonSelected(e.target.id);
    }

    useEffect(() => {
        setButtonSelected("videos")
    }, [])

    const isSubscribed = (subscriberId) => {
        return subscribedTo?.some((sub) => sub.channel === subscriberId)
    }

    useEffect(() => {
        const status = {};
        subscribers?.forEach((subscriber) => {
            status[subscriber.subscriber._id] = isSubscribed(subscriber.subscriber._id);
            // console.log(subscriber.subscriber._id)
        })
        setSubscriptionStatus(status)
    }, [subscribers, subscribedTo])

    const fetchSubscribers = async () => {
        try {
            const res = await axios.get(`/api/subscriptions/c/${channelId}`, { withCredentials: true });
            const { data } = res.data;
            setSubscribers(data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSubscribedChannels = async () => {
        try {
            const res = await axios.get(`/api/subscriptions/u/${channelId}`, { withCredentials: true });
            const { data } = res.data;
            setSubscribedTo(data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchChannelVideos = async () => {
        try {
            const res = await axios.get(`/api/dashboard/videos/${channelId}`, { withCredentials: true });
            const { data } = res.data;
            // console.log(res.data);
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            data.map((video) => {
                const date = new Date(video.createdAt);
                const formattedDate = useFormatDate(date);
                video.uploadedTimeAgo = formattedDate;
            })
            setChannelVideos(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (channelId && currentUser?._id === channelId) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    }, [channelId, currentUser]);

    // console.log(isOwner)

    const fetchChannelDetails = async () => {
        try {
            const res = await axios.get(`/api/users/${channelId}`, { withCredentials: true });
            const data = res.data;
            // console.log(data)

            setChannelDetails(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (channelId) {
            fetchChannelDetails();
            fetchChannelVideos();
            fetchSubscribers();
            fetchSubscribedChannels();
        }
    }, [channelId])

    const handleSubscription = async (channelId) => {
        setSubscriptionStatus({ ...subscriptionStatus, [channelId]: !subscriptionStatus[channelId] })
        try {
            const res = await axios.post(`/api/subscriptions/c/${channelId}`, {}, { withCredentials: true });
            const { data } = res.data;
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className={styles.upperDiv}>
                {(channelId && channelDetails) ? (
                    <>
                        <div className={styles.innerDiv}>
                            <img src={channelDetails?.coverImage || ""} className={styles.channelCover} />
                            <div className={styles.channelDetailsDiv}>
                                <img src={channelDetails?.avatar} alt="" className={styles.channelAvatar} />
                                <div className={styles.channelDetails}>
                                    <h1 className={styles.channelHeading}>{channelDetails?.fullName}</h1>
                                    <p className={styles.channelUsernamePara}>@{channelDetails?.username}</p>
                                    <div className={styles.playlistMeta}>
                                        <span style={{ color: "rgb(196, 195, 195)" }}>{subscribers && subscribers.length} subscribers</span>
                                        <span style={{ color: "rgb(196, 195, 195)" }}>•</span>
                                        <span style={{ color: "rgb(196, 195, 195)" }}>{subscribedTo && subscribedTo.length} subscribed</span>
                                    </div>
                                    <div className={styles.buttonDiv}>
                                        {isOwner ? (
                                            <>
                                                <Button variant="contained" sx={{
                                                    borderRadius: "20px", textTransform: "none", backgroundColor: "rgba(48,48,48, 0.8)", boxShadow: "none", color: "white", '&:hover': {
                                                        backgroundColor: 'rgba(48,48,48, 0.2)',
                                                    },
                                                }}>Customize channel</Button>
                                                <Button variant="contained" sx={{
                                                    borderRadius: "20px", textTransform: "none", backgroundColor: "rgba(48,48,48, 0.8)", boxShadow: "none", color: "white", '&:hover': {
                                                        backgroundColor: 'rgba(48,48,48, 0.2)',
                                                    },
                                                }}>Manage videos</Button>
                                            </>
                                        ) : (

                                            <Button variant="contained" sx={{
                                                fontWeight: 900, backgroundColor: "white", color: "black", borderRadius: "20px", '&:hover': {
                                                    opacity: "0.8",
                                                    backgroundColor: "white"
                                                }
                                            }}>Subscribe</Button>

                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.userButtons}>
                                <Button variant="text" className={buttonSelected === "videos" ? styles.active : ""} id='videos' onClick={handleButtonClick} sx={{
                                    fontWeight: 900, width: "250px", color: "#e0dede85", '&:hover': {
                                        opacity: "0.8",
                                        backgroundColor: "white",
                                        color: "black"
                                    }
                                }}>Videos</Button>
                                <Button variant="text" className={buttonSelected === "tweets" ? styles.active : ""} id='tweets' onClick={handleButtonClick} sx={{
                                    fontWeight: 900, width: "250px", color: "#e0dede85", '&:hover': {
                                        opacity: "0.8",
                                        backgroundColor: "white",
                                        color: "black"
                                    }
                                }}>Tweets</Button>
                                {currentUser?._id === channelId && (
                                    <Button variant="text" id='followings' className={buttonSelected === "followings" ? styles.active : ""} onClick={handleButtonClick} sx={{
                                        fontWeight: 900, width: "250px", color: "#e0dede85", '&:hover': {
                                            opacity: "0.8",
                                            backgroundColor: "white",
                                            color: "black"
                                        }
                                    }}>Followings</Button>
                                )}
                            </div>
                        </div>
                        {buttonSelected === "videos" && (
                            <div className={styles.cardContainer}>
                                {!channelVideos || channelVideos?.length === 0 ? (
                                    <div>
                                        <p>No videos by this user</p>
                                    </div>
                                ) : (
                                    channelVideos && channelVideos?.map((video, i) => (
                                        <div key={i} className={styles.individualVideoDiv}>
                                            <Card sx={{ width: 360, backgroundColor: "#343434", boxShadow: "none" }}>
                                                <div className={styles.cardMediaWrapper}>
                                                    <CardMedia
                                                        sx={{ height: 210 }}
                                                        image={video?.thumbnail}
                                                        className={styles.cardMedia}
                                                    />
                                                    <div className={styles.overlay}>
                                                        <div className={styles.playDiv}>
                                                            <FaPlay size={15} style={{ marginTop: "-2px" }} />
                                                            <p className={styles.playPara}>Play</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <CardContent sx={{ padding: "0", paddingTop: '5px' }}>
                                                    <Typography gutterBottom variant="h5" component="div" sx={{ color: "white", fontSize: "22px" }}>
                                                        {video?.title}
                                                    </Typography>
                                                    <Typography component={"div"} variant="body2" color="text.secondary" sx={{ color: "white", padding: "0" }}>
                                                        <div className={styles.playlistMeta}>
                                                            <span style={{ color: "rgb(196, 195, 195)" }}>{video?.views} Views</span>
                                                            <span style={{ color: "rgb(196, 195, 195)" }}>•</span>
                                                            <span style={{ color: "rgb(196, 195, 195)" }}>{video?.uploadedTimeAgo}</span>
                                                        </div>
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        {buttonSelected === "tweets" && (
                            <Tweet />
                        )}
                        {buttonSelected === "followings" && (
                            (!subscribers || subscribers?.length === 0) && (!subscribedTo || subscribedTo?.length === 0) ? (
                                <p>No followers</p>
                            ) : (
                                subscribers && subscribers?.map((subscriber, i) => (
                                    <div key={i} className={styles.followingsDiv}>
                                        <div className={styles.singleFollowing}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img src={subscriber?.subscriber?.avatar} style={{ width: "40px", borderRadius: "50%" }} />
                                                <p>{subscriber?.subscriber?.username}</p>
                                            </div>

                                            <Button variant='contained' className={subscriptionStatus[subscriber?.subscriber?._id] ? styles.subscribed : ""} onClick={() => handleSubscription(subscriber?.subscriber?._id)}>{subscriptionStatus[subscriber?.subscriber?._id] ? "Subscribed" : "Subscribe"}</Button>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </>
                ) : (
                    <p>Create account</p>
                )}
            </div>
        </>
    )
}
