import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from "./SearchPage.module.css"
import { useQuery } from '../../hooks/useQuery'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { Skeleton } from '@mui/material'

const SearchPage = () => {

    const query = useQuery();
    const searchQuery = query.get("query");
    const navigate = useNavigate();


    const fetchVideos = async (page, query = searchQuery) => {
        const res = await axios.get(`/api/videos/?page=${page}&limit=10&query=${query}`);
        const { data } = res.data;
        // data contains fields like nextPage, totalPages, etc and also an docs array which contains all videos
        return data;
    }

    const { data, error, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["items", searchQuery],
        queryFn: async ({ pageParam = 1 }) => await fetchVideos(pageParam, searchQuery),
        enabled: !!searchQuery,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    })

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const handleVideoClick = async (videoId) => {
        console.log(videoId);
        navigate(`/watch/${videoId}`)
    }

    const goToChannel = (channelId) => {
        // console.log(channelId);
        navigate(`/channel/${channelId}`)
    }

    return (
        status === "pending" ? (
            Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.mainDiv}>
                    <div className={styles.innerDiv}>
                        <div className={styles.cardDiv}>
                            <div className={styles.imgDiv}>
                                <Skeleton animation="wave" variant='rounded' width={450} height={270} sx={{ borderRadius: "12px", backgroundColor: '#2c2c2c' }} />
                            </div>
                            <div className={styles.videoContents}>
                                <Skeleton animation="wave" variant='text' width={"100%"} height={40} sx={{ backgroundColor: '#2c2c2c' }} />
                                <Skeleton animation="wave" variant='text' width={"65%"} sx={{ backgroundColor: '#2c2c2c' }} />
                                <Skeleton animation="wave" variant='text' width={"45%"} sx={{ backgroundColor: '#2c2c2c' }} />
                            </div>
                        </div>
                    </div>
                </div>
            ))
        ) :
            status === 'error' ? <div>{error.message}</div> :
                <div className={styles.mainDiv}>
                    {data.pages.map((page, i) => (
                        <div key={i} className={styles.innerDiv}>
                            {page.docs.map((video, i) => (
                                <div key={i} className={styles.cardDiv}>
                                    <div className={styles.imgDiv}
                                        onClick={() => handleVideoClick(video._id)}
                                    >
                                        <img className={styles.videoThumbnail} src={video.thumbnail} alt="" />
                                    </div>
                                    <div className={styles.videoContents}>
                                        <h3 className={styles.videoTitle} onClick={() => handleVideoClick(video._id)}>{video.title}</h3>

                                        <div style={{ marginBottom: "6px" }} onClick={() => handleVideoClick(video._id)}>
                                            <span style={{ color: "rgb(196, 195, 195)", fontSize: "14px" }}>{video.views} views • 1 year ago</span>
                                        </div>

                                        <div className={styles.ownerInfo}>
                                            <img className={styles.ownerImg} src={video.channelOwner[0].avatar} alt="" />
                                            <p className={styles.videoOwnerName} onClick={() => goToChannel(video.owner)}>{video.channelOwner[0].username}</p>
                                        </div>

                                        <p className={styles.videoDescription} onClick={() => handleVideoClick(video._id)}>{video.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div ref={ref}></div>
                </div>
    )
}

export default SearchPage
