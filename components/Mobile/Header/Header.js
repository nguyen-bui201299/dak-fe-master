import Styles from "./Header.module.css"
import {FaBars, FaRegBell, FaSearch} from "react-icons/fa"
import { useEffect } from 'react'

export default function Header() {

    return (
        <>
        <div className={Styles.header}>
            <div className={Styles.logo}>
                DAK
            </div>
            <div className={Styles.features}>
                <ul className={Styles.listFeatures}>
                    <li className={Styles.ItemFeature}>
                        <FaSearch />
                    </li>
                    <li className={Styles.ItemFeature}>
                        <FaRegBell />
                    </li>
                    <li className={Styles.ItemFeature}>
                        <FaBars />
                    </li>
                </ul>
            </div>
        </div>
        </>
    )
}