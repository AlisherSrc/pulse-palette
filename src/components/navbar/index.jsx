import styles from './navbar.module.css';
import logo from './../../images/logo.svg';
import profile_icon from './../../images/profile-icon.svg';
import { getAuth } from "firebase/auth";
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import Button from '../button';

const Navbar = () => {
    const [isAuth, setisAuth] = useState(true);
    let auth = getAuth();
    useEffect(() => {
        const getUser = () => {

            if (auth.currentUser) {
                setisAuth(true);
            }
        }

        getUser();
    }, []);
    return(<>
            <nav className={`${styles.navbar_section}`}>
                 <div className={`${styles.navbar_container}`}>
                     <Link to="/"><img src={logo} alt='logo' /></Link>
                     {isAuth ? <div className={`${styles.navbar_buttons}`}>
                         <Link to="/playlist-builder"><Button medium text="Create playlist" /></Link>
                         <Link to="/profile"><img src={profile_icon} alt='profile icon' /></Link>
                  </div>
                        : <div className={`${styles.navbar_buttons}`} >
                            <Link to="/login"><Button text="Login" medium /></Link>
                            <Link to="/signup"><Button text="Sign Up" medium color="transparent" /></Link>
                        </div>}
                </div>
            </nav>

    </>

    )
    // return (<nav className={`${styles.navbar_section}`}>
    //     <div className={`${styles.navbar_container}`}>
    //         <Link to="/"><img src={logo} alt='logo' /></Link>
    //         {auth ? <div className={`${styles.navbar_buttons}`}>
    //             <Link to="/playlist-builder"><Button medium text="Create playlist" /></Link>
    //             <Link to="/profile"><img src={profile_icon} alt='profile icon' /></Link>
    //         </div>
    //             : <div className={`${styles.navbar_buttons}`} >
    //                 <Link to=""><Button text="Login" medium /></Link>
    //                 <Link to=""><Button text="Sign Up" medium color="transparent" /></Link>
    //             </div>}
    //     </div>
    // </nav>)
}

export default Navbar;