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


export default function Home() {

    let posts = [];

    for (let i = 0; i < 100; i++) {
        posts.push({
            id: i + 1,
            title: `Post ${i + 1}`,
            // description: `This is post ${i + 1}`,
            image: "/eg/cover.jpg"
        })
    }

    const fetchPost = async (page) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return posts.slice((page - 1) * 20, page * 20);
    }

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['query'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchPost(pageParam);
            return response;
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1;
        },
        initialData: {
            pages: [posts.slice(0, 20)],
            pageParams: [1],
        }
    });

    const lastPostRef = useRef(null);
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    useEffect(() => {
        console.log(entry?.isIntersecting)
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry])

    const _posts = data?.pages.flatMap((page) => page);
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
                                <div key={post.id} ref={ref}>
                                    <Card sx={{ maxWidth: 375, backgroundColor: "#343434", boxShadow: "none" }} key={post.id}>
                                        <CardMedia
                                            sx={{ height: 260, borderRadius: "16px" }}
                                            image="/eg/cover.jpg"
                                            title="green iguana"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div" sx={{ color: "white" }}>
                                                {post.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ color: "white" }}>
                                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                                species, ranging across all continents except Antarctica
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>

                    <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                        {isFetchingNextPage
                            ? "Loding more.."
                            : (data?.pages.length ?? 0) < 3
                                ? "Load more"
                                : "Nothing to load"
                        }
                    </button>
                </div>
            </MantineProvider>
        </>
        // <MantineProvider>

        //     <Paper ref={containerRef} h={300} style={{ overflowY: 'scroll' }}>
        //         <Box pt={260} pb={280}>
        //             <Paper
        //                 ref={ref}
        //                 p="xl"
        //                 style={{
        //                     backgroundColor: entry?.isIntersecting
        //                         ? 'var(--mantine-color-teal-7)'
        //                         : 'var(--mantine-color-red-7)',
        //                     minWidth: '50%',
        //                 }}
        //             >
        //                 <Text c="#fff" fw={700}>
        //                     {entry?.isIntersecting ? 'Fully visible' : 'Obscured'}
        //                 </Text>
        //             </Paper>
        //         </Box>
        //     </Paper>
        // </MantineProvider>
    )
}
