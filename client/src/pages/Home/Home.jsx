import React, { useEffect, useRef, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "./Home.module.css";
import { useInfiniteQuery } from '@tanstack/react-query'
import { useIntersection } from '@mantine/hooks'
import { Text, Paper, Box, MantineProvider } from '@mantine/core';
import { ColorRing } from 'react-loader-spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import { FaPlay } from "react-icons/fa";
import Sidebar from '../../components/Sidebar/Sidebar';

export default function Home() {

    const [posts, setPosts] = useState([]);
    const [isPostsFetched, setIsPostsFetched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/videos/?page=1&limit=20")
                if (res.data.statusCode >= 400 || res.data.success === false) {
                    console.log(res.data.message);
                    return;
                }
                setPosts(res.data.data.docs);
                setIsPostsFetched(true);
            } catch (error) {
                console.log(error)
                setIsPostsFetched(true);
            }
        }
        fetchData();
    }, [])

    const fetchPost = async (page) => {
        // console.log(page)
        try {
            const res = await axios.get(`/api/videos/?page=${page}&limit=20`);
            // console.log(res.data.data.docs)
            // if (res.data.data.docs[0] !== undefined) {
            //     setPosts([...posts, res.data.data.docs[0]]);
            // }
            // return res.data.data.docs;
            // console.log(posts.slice((page - 1) * 10, page * 10))
            // if (res.data.data.docs.length > 0) {
            //     setPosts([...posts, ...res.data.data.docs]);
            // }
            // return posts.slice((page - 1) * 10, page * 10);
            // return posts;
            setIsPostsFetched(true);
            return res.data.data.docs;
        } catch (error) {
            console.log(error)
            setIsPostsFetched(true)
        }
    }

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['query'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchPost(pageParam);
            return response;
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1;
            // return pages.length * 10 < posts.length ? pages.length + 1 : undefined;
        },
        enabled: isPostsFetched,
        initialData: isPostsFetched ? {
            // pages: [posts.slice(0, 20)],
            pages: [],
            pageParams: [1],
        } : undefined
    });

    const lastPostRef = useRef(null);
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });
    // console.log(data)

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry])

    const _posts = data?.pages.flatMap((page) => page);

    const handleVideoClick = async (post) => {

        navigate(`/watch/${post?._id}`);
        try {
            const res = await axios.patch(`/api/videos/increase/view/${post?._id}`, {}, { withCredentials: true });
            const data = res.data;
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <MantineProvider>
                <div className={styles.mainDiv}>
                    <div className={styles.innerDiv}>
                        {_posts?.map((post, i) => {
                            // if (i === _posts.length) {
                            //     return <div key={post.id} ref={ref}>{post.title}</div>
                            // }
                            return (
                                <div key={post?._id} className={styles.individualVideoDiv} ref={ref} onClick={() => handleVideoClick(post)}>
                                    <Card sx={{ width: 375, backgroundColor: "#343434", boxShadow: "none" }} key={post?.id}>
                                        <div className={styles.cardMediaWrapper}>
                                            <CardMedia
                                                sx={{ height: 230, borderRadius: "16px" }}
                                                image={post?.thumbnail}
                                                title={post?.title}
                                                className={styles.cardMedia}
                                            />
                                            <div className={styles.overlay}>
                                                <div className={styles.playDiv}>
                                                    <FaPlay size={15} style={{ marginTop: "-2px" }} />
                                                    <p className={styles.playPara}>Play</p>
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div" sx={{ color: "white" }}>
                                                {post?.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ color: "white" }}>
                                                {post?.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>

                    <div className={styles.loadingDiv}>
                        {/* {isFetchingNextPage
                            ? "Loding more.."
                            : (data?.pages.length ?? 0) < 3
                                ? "Load more"
                                : "Nothing to load"
                        } */}

                        {(isFetchingNextPage || !isPostsFetched) && (
                            <ColorRing
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="color-ring-loading"
                                wrapperStyle={{}}
                                wrapperClass="color-ring-wrapper"
                                colors={["#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9"]}
                            />
                        )}
                    </div>
                </div>
            </MantineProvider>
        </>
    )
}
