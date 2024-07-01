import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from "./VideoPlayer.module.css"

export default function VideoPlayer() {
    const { videoId } = useParams();
    const [videoDetails, setVideoDetails] = useState("");

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await axios.get(`/api/videos/${videoId}`, { withCredentials: true });
                const data = res.data;
                setVideoDetails(data.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchVideo();
    }, [videoId])

    return (
        <div className={styles.mainDiv}>
            <div>
                <div className={styles.leftDiv}>
                    <ReactPlayer url={videoDetails.videoFile} controls width={"65%"} height={"auto"} />
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
            </div>
        </div>
    )
}
