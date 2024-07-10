import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import styles from "./Main.module.css"
import Home from '../Home/Home'
import Subscription from '../Subscription/Subscription'
import Playlist from '../Playlist/Playlist'
import YourChannel from '../YourChannel/YourChannel'
import { useLocation, useParams } from 'react-router-dom'
import History from '../History/History'

export default function Main() {

    const { channelId } = useParams()
    return (
        <div className={styles.homeDiv}>
            <div>
                <Sidebar />
            </div>
            <div style={{ width: "100%" }}>
                <div className={styles.mainDiv}>
                    {location.pathname === "/" && <Home />}
                    {location.pathname === "/subscriptions" && <Subscription />}
                    {location.pathname === "/playlist" && <Playlist />}
                    {location.pathname === `/channel/${channelId}` && <YourChannel />}
                    {location.pathname === "/channel/you" && <YourChannel />}
                    {location.pathname === "/history" && <History />}
                </div>
            </div>
        </div>
    )
}
