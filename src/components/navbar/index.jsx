import styles from './navbar.module.css';
import logo from './../../images/logo.svg';
import profile_icon from './../../images/profile-icon.svg';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Button from '../button';
import { Context } from '../../App';

const Navbar = () => {
    const [isAuth, setisAuth] = useState(false);
    const {customUser} = useContext(Context);
    
    let auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setisAuth(true);
            } else {
                setisAuth(false);
            }
        });

        console.log("Navbar")
    
        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, [auth]);

    return (<>
        <nav className={`${styles.navbar_section}`}>
            <div className={`${styles.navbar_container}`}>
                <Link to="/"><img src={logo} alt='logo' /></Link>
                {isAuth ? <div className={`${styles.navbar_buttons}`}>
                    <Link to="/playlist-builder"><Button medium text="Create playlist" /></Link>
                    <Link to="/profile" className={styles.avatar_container} ><img className={styles.profile_icon} src={customUser?.avatarUrl ?? "https://www.vippng.com/png/full/363-3631840_profile-icon-png-profile-icon-png-white-transparent.png"} alt='profile icon'/></Link>
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