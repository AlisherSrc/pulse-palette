import styles from './navbar.module.css';
import logo from './../../images/logo.svg';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Button from '../button';
import { Context } from '../../App';
import useGetUserPlaylists from '../../hooks/useGetUserPlaylists';
import Checkout from '../checkout';

const Navbar = () => {
    const [isAuth, setisAuth] = useState(false);
    const {customUser} = useContext(Context);
    const [userPlaylists, loading, error] = useGetUserPlaylists();
    const [showPopup,setShowPopup] = useState(false);
    const [allowed,setAllowed] = useState(true);

    let auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setisAuth(true);
            } else {
                setisAuth(false);
            }
        });
    
        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, [auth]);

    useEffect(() => {
        if(userPlaylists.length >= 5 && !customUser?.subscription){
            setAllowed(false);
        }else if(userPlaylists.length < 5 || customUser?.subscription){
            setAllowed(true);
        }
    },[customUser,userPlaylists.length])


    return (<>
        {showPopup && <Checkout setShowPopup={setShowPopup}/>}
        <nav className={`${styles.navbar_section}`}>
            <div className={`${styles.navbar_container}`}>
                <Link to="/"><img src={logo} alt='logo' /></Link>
                {isAuth ? <div className={`${styles.navbar_buttons}`}>
                    {/* If user is not premium and already has 5 playlists then we show other button */}
                    {(!allowed) && <div className={styles.createPlaylist} onClick={() => setShowPopup(!showPopup)}><Button medium text="Upgrade" /></div>}
                    {/* If user is premium or has less than 5 playlists then we should regular button */}
                    {(allowed) && <Link to="/playlist-builder" className={styles.createPlaylist}><Button  medium text="Create playlist" /></Link>}
                    <Link to="/profile" className={styles.avatar_container} ><img className={styles.profile_icon} src={customUser?.avatarUrl ?? "data:image/png;base64,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"} alt='profile icon'/></Link>
                </div>
                    : <div className={`${styles.navbar_buttons}`} >
                        <Link to="/login" ><Button text="Login" medium style={{ border: 'none' }} /></Link>
                        <div className={styles.signButton}>
                        <Link to="/signup" ><Button  text="Sign Up" medium color="transparent" /></Link>

                        </div>
                    </div>}
            </div>
        </nav>

    </>
    )
}

export default Navbar;