import React from 'react'
import styles from './UploadVideo.module.css'
import { Button, TextField } from '@mui/material'
import Textarea from '@mui/joy/Textarea'
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiVideo } from "react-icons/fi";
import { TfiVideoClapper } from "react-icons/tfi";
import { TfiVideoCamera } from "react-icons/tfi";
import { BiSolidVideoRecording } from "react-icons/bi";
import { PiImageDuotone } from "react-icons/pi";


const UploadVideo = () => {
    return (
        <div className={styles.mainDiv}>
            <div className={styles.innerDiv}>
                <div className={styles.headingDiv}>
                    <h1>Upload video</h1>
                </div>
                <div className={styles.formDiv}>
                    <div className={styles.upperDiv}>
                        <div className={styles.leftDiv}>
                            <Textarea
                                minRows={3}
                                id="outlined-basic"
                                placeholder='Title'
                                variant="outlined"
                                sx={{
                                    background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.6)",
                                    '&:hover': {
                                        color: "white",
                                        border: "1px solid white",
                                    },
                                    '--Textarea-focusedInset': 'none',
                                }}
                            />
                            <Textarea
                                minRows={5}
                                placeholder='Description'
                                size="lg"
                                variant="outlined"
                                sx={{
                                    background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.6)",
                                    '&:hover': {
                                        color: "white",
                                        border: "1px solid white",
                                    },
                                    '--Textarea-focusedInset': 'none',
                                }}
                            />
                        </div>
                        <div className={styles.rightDiv}>
                            <div className={styles.videoDiv}>
                                <IoCloudUploadOutline size={100} style={{ color: "rgba(255,255,255,0.5)" }} />
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.3)',
                                        },
                                    }}
                                >Upload Video</Button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.lowerDiv}>
                        <div className={styles.thumbnailDiv}>
                            <>
                                <PiImageDuotone size={100} style={{ color: "rgba(255,255,255,0.5)" }} />
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.3)',
                                        },
                                    }}
                                >Upload Thumbnail</Button>
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadVideo
