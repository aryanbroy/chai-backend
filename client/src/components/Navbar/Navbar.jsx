import React, { useEffect, useRef, useState } from 'react'
import styles from "./Navbar.module.css"
import { RiVideoUploadFill } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import { Button, TextField } from '@mui/material'
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios'


export default function Navbar() {
    const { currentUser } = useSelector((state) => state.user);
    const searchDivRef = useRef(null);
    const [searchWidth, setSearchWidth] = useState("auto");
    const [searchInputValue, setSearchInputValue] = useState("sf");
    const [suggestions, setSuggestions] = useState(null);

    useEffect(() => {
        if (searchDivRef.current) {
            setSearchWidth(`${searchDivRef.current.offsetWidth}px`);
        }
    }, [])



    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await axios.post(`/api/videos/suggestions`, { query: searchInputValue });
                const { data } = res.data;
                setSuggestions(data);
            } catch (error) {
                console.log(error)
            }
        }
        if (searchInputValue.length > 0) {
            fetchSuggestions();
        }

    }, [searchInputValue])

    return (
        <div className={styles.navMainDiv}>
            <div className={styles.navInnerDiv}>
                <div>
                    <Link to={"/"}>
                        <h1 className={styles.heading}>Sometube</h1>
                    </Link>
                </div>
                <div className={styles.searchDiv}>
                    <div>
                        <TextField
                            value={searchInputValue}
                            onChange={(e) => setSearchInputValue(e.target.value)}
                            ref={searchDivRef} id="outlined-basic" placeholder='Search'
                            variant="outlined" size='small'
                            InputProps={{ sx: { borderTopLeftRadius: "25px", borderBottomLeftRadius: "25px", border: "1px #848482 solid", color: "white" } }}
                            className={styles.inputField}
                            sx={{
                                width: "600px",
                                "& .MuiInputLabel-outlined": {
                                    color: "white",
                                    fontWeight: "bold",
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& .MuiInputBase-input::placeholder': {
                                        color: '#A9A9A9',
                                        opacity: 1,
                                    },
                                },
                            }}
                        />
                        <Button variant='text' sx={{ border: "1px solid #848482", borderTopRightRadius: "25px", borderBottomRightRadius: "25px", color: "#A9A9A9", backgroundColor: "#343434", marginLeft: "-5px" }}><FaSearch size={28} /></Button>
                    </div>
                    {searchInputValue.length > 0 && (
                        <div className={styles.suggestionsDiv} style={{ width: searchWidth }}>
                            {suggestions?.map((suggestion, i) => (
                                <p key={i}>{suggestion.title}</p>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.rightSideNav}>
                    <RiVideoUploadFill size={30} />
                    <IoNotifications size={30} />
                    {currentUser ? (
                        <div className={styles.avatarDiv}>
                            <img src={currentUser?.avatar} alt="avatar" className={styles.avatar} />
                        </div>
                    ) : (
                        <Link to={"/login"} style={{ color: "white" }}>
                            <Button variant="contained" sx={{ width: "100px", height: "40px", fontSize: "15px", fontWeight: "700" }}>
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
