import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from "./SearchPage.module.css"
import { useQuery } from '../../hooks/useQuery'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

const SearchPage = () => {

    const query = useQuery();
    const searchQuery = query.get("query");
    const [searchResults, setSearchResults] = useState(null);


    const fetchVideos = async (page, query = searchQuery) => {
        const res = await axios.get(`/api/videos/?page=${page}&limit=10&query=${query}`);
        const { data } = res.data;
        // console.log(data)
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

    return (
        status === "pending" ? <p>Loading...</p> :
            status === 'error' ? <div>{error.message}</div> :
                <div className={styles.mainDiv}>
                    {data.pages.map((page, i) => (
                        <div key={i}>
                            {page.docs.map((video, i) => (
                                <div key={i} className={styles.cardDiv}>
                                    <div className={styles.imgDiv}>
                                        <img className={styles.videoThumbnail} src={video.thumbnail} alt="" />
                                    </div>
                                    <div className={styles.videoContents}>
                                        <h3 className={styles.videoTitle}>{video.title}</h3>
                                        <div style={{ marginBottom: "6px" }}>
                                            <span style={{ color: "rgb(196, 195, 195)", fontSize: "14px" }}>{video.views} views • 1 year ago</span>
                                        </div>
                                        <div className={styles.ownerInfo}>
                                            <img className={styles.ownerImg} src={video.channelOwner[0].avatar} alt="" />
                                            <p className={styles.videoOwnerName}>{video.channelOwner[0].username}</p>
                                        </div>
                                        <p className={styles.videoDescription}>{video.description}</p>
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
