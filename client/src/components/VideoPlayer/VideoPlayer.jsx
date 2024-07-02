import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from "./VideoPlayer.module.css"
import { formatDistanceToNow } from 'date-fns';

export default function VideoPlayer() {
    const { videoId } = useParams();
    const [videoDetails, setVideoDetails] = useState("");
    let time = ""
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await axios.get(`/api/videos/${videoId}`, { withCredentials: true });
                const data = res.data;
                setVideoDetails(data.data);
                const date = new Date(data.data.createdAt);
                const formattedDate = formatDistanceToNow(date, { addSuffix: true });
                setVideoDetails({ ...data.data, uploadedTimeAgo: formattedDate })
            } catch (error) {
                console.log(error)
            }
        }
        fetchVideo();
    }, [videoId]);

    return (
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
                <h1>More videos here</h1>
            </div>
        </div>
    )
}
