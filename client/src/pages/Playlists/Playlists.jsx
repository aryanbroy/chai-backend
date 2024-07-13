import React, { useEffect, useState } from 'react';
import styles from "./Playlists.module.css"
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Playlists() {

    const { currentUser } = useSelector((state) => state.user);
    const [userPlaylists, setUserPlaylists] = useState([]);
    // console.log(userPlaylists)
    const navigate = useNavigate();

    const fetchPlaylists = async () => {
        try {
            const res = await axios.get(`/api/playlist/user/${currentUser._id}`, { withCredentials: true });
            const data = res.data;
            // console.log(data)
            setUserPlaylists(data.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPlaylists();
    }, [])

    const handleClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    }

    return (
        <div className={styles.playlistMainDiv}>
            {userPlaylists?.map((playlist, i) => (
                <div className={styles.playlistCard} key={i} onClick={() => handleClick(playlist?._id)}>
                    <div className={styles.imageContainer}>
                        <img className={styles.playlistImage} src={playlist?.videos[0]?.thumbnail} alt="" />
                        <div className={styles.overlay}></div>
                    </div>
                    <div className={styles.playlistInfo}>
                        <div className={styles.playlistTitle}>{playlist?.name}</div>
                        <div className={styles.playlistMeta}>
                            <span>100k Views</span>
                            <span>•</span>
                            <span>18 hours ago</span>
                        </div>
                        <div className={styles.playlistVideos}>{playlist?.videos?.length} videos</div>
                    </div>
                </div>
            ))}
        </div>
    )
}
