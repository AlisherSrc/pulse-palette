import styles from './navbar.module.css';
import logo from './../../images/logo.svg';
import profile_icon from './../../images/profile-icon.svg';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '../button';

const Navbar = () => {
    const [auth, setAuth] = useState(true);


    return (<nav className={`${styles.navbar_section}`}>
        <div className={`${styles.navbar_container}`}>
            <Link to="/"><img src={logo} alt='logo' /></Link>
            {auth ? <div className={`${styles.navbar_buttons}`}>
                <Button medium text="Create playlist" />
                <img src={profile_icon} alt='profile icon' />
            </div>
                : <div className={`${styles.navbar_buttons}`} >
                    <Button text="Login" medium />
                    <Button text="Sign Up" medium color="transparent" />
                </div>}
        </div>
    </nav>)
}

export default Navbar;