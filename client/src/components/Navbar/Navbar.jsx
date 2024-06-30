import React from 'react'
import styles from "./Navbar.module.css"
import { RiVideoUploadFill } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import { Button, TextField } from '@mui/material'
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';


export default function Navbar() {
    return (
        <div className={styles.navMainDiv}>
            <div className={styles.navInnerDiv}>
                <div>
                    <Link to={"/"}>
                        <h1 className={styles.heading}>Youtube</h1>
                    </Link>
                </div>
                <div>
                    <TextField id="outlined-basic" label="Search" variant="outlined" size='small'
                        InputProps={{ sx: { borderTopLeftRadius: "25px", borderBottomLeftRadius: "25px", border: "1px #848482 solid" } }}
                        className={styles.inputField}
                        sx={{
                            width: "600px",
                            "& .MuiInputLabel-outlined": {
                                color: "#A9A9A9",
                                fontWeight: "bold",
                            },
                        }}
                    />
                    <Button variant='text' sx={{ border: "1px solid #848482", borderTopRightRadius: "25px", borderBottomRightRadius: "25px", color: "#A9A9A9", backgroundColor: "#343434", marginLeft: "-5px" }}><FaSearch size={28} /></Button>
                </div>
                <div className={styles.rightSideNav}>
                    <p><RiVideoUploadFill size={30} /></p>
                    <p><IoNotifications size={30} /></p>
                    <Link to={"/login"} style={{ color: "white" }}>
                        <Button variant="contained" sx={{ width: "100px", height: "40px", fontSize: "15px", fontWeight: "700" }}>

                            Login

                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
