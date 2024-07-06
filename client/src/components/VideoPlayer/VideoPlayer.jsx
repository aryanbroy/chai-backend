import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from "./VideoPlayer.module.css"
import { formatDistanceToNow } from 'date-fns';
import { ColorRing } from 'react-loader-spinner';
import { FaPlay } from 'react-icons/fa';

export default function VideoPlayer() {
    const { videoId } = useParams();
    const [videoDetails, setVideoDetails] = useState("");
    const [suggestedVideos, setSuggestedVideos] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/videos/${videoId}`, { withCredentials: true });
                const data = res.data;
                setVideoDetails(data.data);
                const date = new Date(data.data.createdAt);
                const formattedDate = formatDistanceToNow(date, { addSuffix: true });
                setLoading(false)
                setVideoDetails({ ...data.data, uploadedTimeAgo: formattedDate })
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        fetchVideo();
    }, [videoId]);

    useEffect(() => {
        const fetchSuggestedVideos = async () => {
            try {
                const res = await axios.get(`/api/videos/sideVideos/${videoId}`);
                const data = res.data;
                data.data.map((video) => {
                    const date = new Date(video.createdAt);
                    const formattedDate = formatDistanceToNow(date, { addSuffix: true });
                    video.uploadedTimeAgo = formattedDate
                })
                setSuggestedVideos(data.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchSuggestedVideos()
    }, [videoId])

    const handleSidebarClick = async (video) => {
        navigate(`/watch/${video?._id}`);
        try {
            const res = await axios.patch(`/api/videos/increase/view/${video?._id}`, {}, { withCredentials: true });
            const data = res.data;
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            {loading ? (
                <div className={styles.loadingDiv}>
                    <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={["#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9"]}
                    />
                </div>
            ) : (
                <div className={styles.mainDiv}>
                    <div className={styles.leftDiv}>
                        <div>
                            <ReactPlayer url={videoDetails.videoFile} controls width={"100%"} height={"auto"} />
                        </div>
                        <h1 className={styles.videoTitle}>{videoDetails.title}</h1>
                        <div className={styles.channelDiv}>
                            <div className={styles.avatarDiv}>
                                <img src={videoDetails.owner?.avatar} alt="" className={styles.avatar} />
                            </div>
                            <div className={styles.channelNameDiv}>
                                <h4 className={styles.channelName}>{videoDetails.owner?.username}</h4>
                            </div>
                        </div>
                        <div className={styles.descriptionDiv}>
                            <div className={styles.viewsDiv}>
                                <p className={styles.viewsPara}>{videoDetails?.views} views</p>
                                <p>{videoDetails?.uploadedTimeAgo}</p>
                            </div>
                            <div>
                                <p>{videoDetails.description}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        {suggestedVideos?.map((video) => {
                            return (
                                <div className={styles.cardDiv} key={video?._id} onClick={() => handleSidebarClick(video)}>
                                    <div className={styles.cardMediaWrapper}>
                                        <img src={video?.thumbnail} alt="" style={{ width: "180px", height: "110px", borderRadius: "10px" }} className={styles.cardMedia} />
                                        <div className={styles.overlay}>
                                            <div className={styles.playDiv}>
                                                <FaPlay size={10} style={{ marginTop: "-2px" }} />
                                                <p className={styles.playPara}>Play</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.suggestedTitle}>
                                        <p className={styles.suggestedTitlePara}>{video?.title}
                                        </p>
                                        <p className={styles.suggestedVideoOwner}>{video?.owner?.username}</p>
                                        <div className={styles.suggestedViewsTime}>
                                            <p className={styles.suggestedViews}>{video?.views} views</p>
                                            <p className={styles.suggestedTime}>{video?.uploadedTimeAgo}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
