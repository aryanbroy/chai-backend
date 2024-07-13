import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from "./VideoPlayer.module.css"
import { formatDistanceToNow } from 'date-fns';
import { ColorRing } from 'react-loader-spinner';
import { FaPlay } from 'react-icons/fa';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { IoIosShareAlt } from "react-icons/io";
import { PiShareFatLight } from "react-icons/pi";
import { useSelector } from 'react-redux'
import { Button, TextField } from "@mui/material"
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';

const posts = [
    { id: 1, title: "post 1" },
    { id: 2, title: "post 2" },
    { id: 3, title: "post 3" },
    { id: 4, title: "post 4" },
    { id: 5, title: "post 5" },
    { id: 6, title: "post 6" },
]

export default function VideoPlayer() {

    const navigate = useNavigate();
    const { videoId } = useParams();
    const [videoDetails, setVideoDetails] = useState({});
    const [suggestedVideos, setSuggestedVideos] = useState(null);
    const [videoLikes, setVideoLikes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [likedByUser, setLikedByUser] = useState(false);
    const [commentsFetched, setCommentsFetched] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);

    // console.log(videoDetails)

    // const fetchComments = async (pageParam) => {
    //     try {
    //         // setCommentsFetched(false)
    //         const res = await axios.get(`/api/comments/${videoId}??page=${pageParam}&limit=3`, { withCredentials: true });
    //         const data = res.data;
    //         console.log(data);
    //         setComments(data.data.docs)

    //         setCommentsFetched(true);
    //     } catch (error) {
    //         console.log(error)
    //         setCommentsFetched(true)
    //     }
    // }

    const updateWatchHistory = async () => {
        const res = await axios.patch(`/api/users/updateHistory`, { videoId }, { withCredentials: true });
        const data = res.data;
    }

    const handleLike = async () => {
        try {
            if (currentUser) {
                setLikedByUser(!likedByUser);
                if (likedByUser) {
                    setVideoLikes(videoLikes - 1);
                } else {
                    setVideoLikes(videoLikes + 1);
                }
            }
            const res = await axios.post(`/api/likes/toggle/v/${videoId}`, {}, { withCredentials: true });
        } catch (error) {
            console.log(error);
        }
    }

    const fetchLikedByUser = async () => {
        try {
            const res = await axios.get(`/api/likes/videos`, { withCredentials: true });
            const data = res.data;
            const liked = data.data.some((video) => video._id === videoId);
            setLikedByUser(liked);
        } catch (error) {
            console.log(error)
        }
    }

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

    const fetchLikesOfVideo = async () => {
        try {
            const res = await axios.get(`/api/likes/getLikes/${videoId}`, { withCredentials: true });
            const data = res.data;
            // setVideoDetails({ ...videoDetails, likes: data.data });
            setVideoLikes(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await Promise.all([
                    updateWatchHistory(),
                    fetchLikesOfVideo(),
                    fetchVideo(),
                    fetchSuggestedVideos(),
                    fetchLikedByUser(),
                    // fetchComments(),
                ])
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllData();
    }, [videoId]);

    const handleSidebarClick = async (video) => {
        navigate(`/watch/${video?._id}`);
        try {
            const res = await axios.patch(`/api/videos/increase/view/${video?._id}`, {}, { withCredentials: true });
            const data = res.data;
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPost = async (page) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return posts.slice((page - 1) * 2, page * 2)
    }

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["comments"],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchPost(pageParam);
            return response;
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1
        },
        initialData: {
            pages: [posts.slice(0, 2)],
            pageParams: [1],
        }
    })

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
                        <div className={styles.channelMainDiv}>
                            <div className={styles.channelDiv}>
                                <div className={styles.avatarAndNameDiv}>
                                    <div className={styles.avatarDiv}>
                                        <img src={videoDetails.owner?.avatar} alt="" className={styles.avatar} />
                                    </div>
                                    <div className={styles.channelNameDiv}>
                                        <h4 className={styles.channelName}>{videoDetails.owner?.username}</h4>
                                    </div>
                                </div>
                                <div className={styles.likesDislikeAndShareDiv}>
                                    <div className={styles.likeDislikeDiv}>
                                        <div className={styles.likeDiv} onClick={handleLike}>{likedByUser ? <AiFillLike /> : <AiOutlineLike />} {videoLikes}</div>
                                        <div className={styles.dislikeDiv}><AiOutlineDislike /></div>
                                    </div>
                                    <div className={styles.shareDiv}><PiShareFatLight /> Share</div>
                                </div>
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
                        <div className={styles.commentDiv}>
                            <h2 className={styles.commentHeading}>20 comment(s)</h2>
                            <div className={styles.commentBoxDiv}>
                                <img src={currentUser ? currentUser.avatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="" className={styles.avatar} />
                                <div className={styles.commentBox}>
                                    <TextField placeholder='Add a comment' id="standard-basic" variant="standard" InputLabelProps={{ style: { color: "white" }, shrink: false }}
                                        sx={{
                                            width: "100%",
                                            marginTop: "-5px",
                                            color: "white",
                                            '& .MuiInput-underline:before': {
                                                borderBottomColor: '#A9A9A9',
                                            },
                                            '& .MuiInput-underline:hover:before': {
                                                borderBottomColor: '#A9A9A9',
                                            },
                                            '& .MuiInput-underline:after': {
                                                borderBottomColor: 'white',
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: 'white',
                                            },
                                            '& .MuiInputBase-input': {
                                                color: 'white',
                                            },
                                        }}
                                    />
                                    <div className={styles.buttonDiv}>
                                        <Button variant="text" className={styles.cancelCommentBtn}
                                            sx={{
                                                borderRadius: '20px',
                                                width: '110px',
                                                color: "white"
                                            }}
                                        >Cancel</Button>
                                        <Button variant='contained' className={styles.postCommentBtn}
                                            sx={{
                                                borderRadius: '20px',
                                                width: '110px',
                                                height: "40px",
                                                color: "#332d2d"
                                            }}
                                        >Comment</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data?.pages.map((page, i) => (
                            <div key={i}>
                                {page.map((post) => (
                                    <div key={post._id}>
                                        {post.title}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                            {isFetchingNextPage
                                ? "Loading more..."
                                : (data?.pages.length ?? 0) < 3
                                    ? "Load more"
                                    : "Nothing more to load"
                            }
                        </button>
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
