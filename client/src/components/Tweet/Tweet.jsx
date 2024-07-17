import React, { useEffect, useState } from 'react'
import styles from "./Tweet.module.css"
import { AiOutlineLike } from 'react-icons/ai'
import { PiShareFatFill } from "react-icons/pi";
import { FaEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Textarea from '@mui/joy/Textarea';
import { Button } from '@mui/material';
import { ColorRing } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';

const maxLength = 280;

export default function Tweet() {
    const { currentUser } = useSelector((state) => state.user);
    const [userTweets, setUserTweets] = useState(null);
    const [tweetInput, setTweetInput] = useState("");
    const [tweeting, setTweeting] = useState(false);
    const [error, setError] = useState(null);
    const { channelId } = useParams();

    const fetchUserTweets = async () => {
        try {
            const res = await axios.get(`/api/tweets/user/${channelId}`, { withCredentials: true });
            const { data } = res.data;
            // console.log(data);
            setUserTweets(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserTweets();
    }, [])


    const createTweet = async () => {
        try {
            setTweeting(true)
            setError(null);
            const res = await axios.post(`/api/tweets/`, { content: tweetInput }, { withCredentials: true });
            const { data } = res.data;
            // console.log(data)
            setTweeting(false);
            setError(null);
            setTweetInput("");
        } catch (error) {
            // console.log(error)
            console.log(error.response.data.message)
            setError(error.response.data.message);
            setTweeting(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTweet();
    }

    const handleInputChange = (e) => {
        if (e.target.value.length <= maxLength) {
            setError(null)
            setTweetInput(e.target.value);
        } else {
            setError("Max character limit reached");
        }
    }

    return (
        <>
            <>
                <div className={styles.createTweetMainDiv}>
                    <div className={styles.createTweetInnerDiv}>
                        <div className={styles.ownerImageDiv}>
                            <img src={currentUser?.avatar} alt="" style={{ width: "45px", borderRadius: "50%" }} />
                            <p className={styles.ownerName}>{currentUser?.username}</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <Textarea
                                value={tweetInput}
                                onChange={handleInputChange}
                                size="lg"
                                variant="plain"
                                placeholder={`What is on your mind, ${currentUser?.username}?`}
                                sx={{
                                    background: "transparent", color: "white",
                                    '&:hover': {
                                        color: "white",
                                    },
                                    '--Textarea-focusedInset': 'none',
                                }}
                            />
                            <div className={styles.btnDiv} style={{ width: "100%" }}>
                                <Button disabled={!tweetInput} variant='text' sx={{
                                    color: "white", padding: "0px 15px", borderRadius: "28px",
                                    "&.Mui-disabled": {
                                        backgroundColor: "rgba(255,255,255,0.1)",
                                        color: "rgba(255,255,255,0.8)",
                                    },
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.1)",
                                    },
                                }} onClick={() => setTweetInput("")}>Cancel</Button>
                                <Button disabled={!tweetInput || tweeting} variant="contained" sx={{
                                    borderRadius: "28px",
                                    "&.Mui-disabled": {
                                        backgroundColor: "rgba(25, 118, 210, 0.8)",
                                        color: "rgba(255,255,255,0.8)",
                                    },
                                }} type='submit'>{tweeting ?
                                    <ColorRing
                                        visible={true}
                                        height="25"
                                        width="48"
                                        ariaLabel="color-ring-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="color-ring-wrapper"
                                        colors={["#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9"]}
                                    /> :
                                    "Tweet"
                                    }
                                </Button>
                            </div>
                        </form>
                        <p>{tweetInput.length}/280</p>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                </div >
                {userTweets && userTweets.map((tweet, i) => (
                    <div className={styles.tweetMainDiv} key={i}>
                        <div className={styles.innerDiv}>
                            <div className={styles.imgDiv}>
                                <img src={tweet?.owner.avatar} alt="" style={{ width: '50px', borderRadius: "50%" }} className={styles.img} />
                            </div>
                            <div className={styles.tweetContentDiv}>
                                <p className={styles.tweetOwner}>{tweet.owner.username}</p>
                                <p className={styles.tweetContent}>{tweet.content}</p>
                                <div className={styles.userControlDiv}>
                                    <p className={styles.tweetLike}><AiOutlineLike />17</p>
                                    <p className={styles.tweetShare}><PiShareFatFill size={18} />Share</p>
                                    <p className={styles.tweetEdit}><FaEdit />Edit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        </>
    )
}
