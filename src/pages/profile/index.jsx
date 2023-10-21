import { useEffect, useState } from "react";
import styles from "./profile.module.css";
import Register from "../register";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {Button} from 'antd';


const Profile = () => {
    const [isAuth, setisAuth] = useState(false);
    const [currUser, setCurrUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    let auth = getAuth();

    useEffect(() => {
        const getUser = () => {

            if (auth.currentUser) {
                setisAuth(true);
                setCurrUser(auth.currentUser);
            }
        }

        getUser();
    }, []);
    useEffect(() => {
        setLoading(true);
        const docs = [];
        const getPlaylists = async () =>{
            const q = query(collection(db,"playlist"));
            const playlistDocs = await getDocs(q)

            playlistDocs.forEach((doc) => {
                docs.push({id: doc.id,...doc.data()});
            })

            setPlaylists(docs);
            setLoading(false);
        }
        getPlaylists();
    },[])

    const signOut = () => {

        auth.signOut().then(() => {
            nav("/");
        }).catch((err) => console.log(err));
    }

    return (<>
        {isAuth ?
            <div className={`${styles.body}`}>
                <div className={`${styles.profilePart}`}>
                    <img src="https://www.vippng.com/png/full/363-3631840_profile-icon-png-profile-icon-png-white-transparent.png" alt="" width='160px'/>
                    <div className={`${styles.userData}`}>
                        <h3>Profile</h3>
                        <h2>Email: {currUser.email}</h2>                    
                    <Button danger ghost onClick={signOut}>Sign Out</Button>
                    </div>
                </div>
                <div className={`${styles.list}`}>
                    <h3>Playlists</h3>
                </div>
                <div className={`${styles.playlists}`}>
                    {playlists.map((playlist) => (
                        <a href={`/playlist/${playlist.id}`}>
                            <div className={`${styles.playlist}`} key={playlist.id}>
                            <img src={playlist.imageUrl} alt="" />
                            <div className={`${styles.playlistTitle}`}>
                                <h4>{playlist.title}</h4>
                                </div>
                            <div className={`${styles.playlistSubtitle}`}>
                                <p>{playlist.description}</p>
                                </div>
                        </div>
                        </a>
                    ))}
                </div>
            </div>

            : <Register />}
    </>)
}

export default Profile;