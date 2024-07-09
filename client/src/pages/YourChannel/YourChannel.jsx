import React, { useEffect, useState } from 'react'
import styles from './YourChannel.module.css'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material'
import { ColorRing } from 'react-loader-spinner';

export default function YourChannel() {
    const [isOwner, setIsOwner] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const { channelId } = useParams();
    const [channelDetails, setChannelDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

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
        }
    }, [channelId])

    return (
        <>
            <div className={styles.upperDiv}>
                {(channelId && channelDetails) ? (
                    <div className={styles.channelDetailsDiv}>
                        <img src={channelDetails?.avatar} alt="" className={styles.channelAvatar} />
                        <div className={styles.channelDetails}>
                            <h1 className={styles.channelHeading}>{channelDetails?.fullName}</h1>
                            <p className={styles.channelUsernamePara}>@{channelDetails?.username}</p>
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
                ) : (
                    <p>Create account</p>
                )}
            </div>
        </>
    )
}
