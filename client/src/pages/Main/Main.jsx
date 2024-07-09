import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import styles from "./Main.module.css"
import Home from '../Home/Home'
import Subscription from '../Subscription/Subscription'

export default function Main() {
    console.log(location.pathname)
    return (
        <div className={styles.homeDiv}>
            <div>
                <Sidebar />
            </div>
            <div>
                {location.pathname === "/" && <Home />}
                {location.pathname === "/subscriptions" && <Subscription />}
            </div>
        </div>
    )
}
