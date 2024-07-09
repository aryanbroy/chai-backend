import React, { useState } from 'react';
import styles from "./Sidebar.module.css"
import { IoMdHome } from "react-icons/io";
import { MdOutlineExplore } from "react-icons/md";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlinePlaylistPlay } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const [activePara, setActivePara] = useState("home");
    const navigate = useNavigate();
    const handleSidebarClick = (e) => {
        setActivePara(e);
        if (e !== "home") {
            navigate(`/${e}`)
        }
        else {
            navigate("/")
        }
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.paraDiv}>
                <p id={styles.paraId} className={activePara === "home" ? styles.active : ""} onClick={() => handleSidebarClick("home")}><IoMdHome size={25} style={{ marginBottom: "5px" }} /> Home</p>
                <p id={styles.paraId} className={activePara === "subscriptions" ? styles.active : ""} onClick={() => handleSidebarClick("subscriptions")}><MdOutlineSubscriptions size={25} />Subscriptions</p>
                <p id={styles.paraId} className={activePara === "playlist" ? styles.active : ""} onClick={() => handleSidebarClick("playlist")}><MdOutlinePlaylistPlay size={33} style={{ paddingLeft: "2px" }} /> Playlist</p>
            </div>
        </div>
    )
}
