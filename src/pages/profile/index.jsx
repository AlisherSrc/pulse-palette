import { useEffect, useState } from "react";
import styles from "./profile.module.css";
import Register from "../register";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Group from "../../components/group";
import { Button } from 'antd';
// import { Group } from "antd/es/avatar";


const Profile = () => {
    const [isAuth, setisAuth] = useState(false);
    const [currUser, setCurrUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    let auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,(user) => {
            if(user){
                setCurrUser(user);
                setisAuth(true);
            }else{
                setisAuth(false);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        const docs = [];
        const getPlaylists = async () => {
            setLoading(true);
            console.log("getting")
            const q = query(collection(db, "playlist"),where('userEmail','==',currUser.email));
            const playlistDocs = await getDocs(q)

            playlistDocs.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            })

            setPlaylists(docs);
            setLoading(false);
        }


        if(isAuth) getPlaylists();
        else console.log("Not authrorized") 

    }, [isAuth])

    const signOut = () => {

        auth.signOut().then(() => {
            nav("/");
        }).catch((err) => console.log(err));
    }

    return (<>
        {isAuth ?
            <div className={`${styles.body}`}>
                <div className={`${styles.profilePart}`}>
                    <img src="https://www.vippng.com/png/full/363-3631840_profile-icon-png-profile-icon-png-white-transparent.png" alt="" width='160px' />
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
                    {/* Still undefined when click*, address this issue by providing query or something to do with it */}
                    {!loading ? <Group title="Created Playlists" inputPlaylists={playlists} /> : "Loading"}
                    <Group title="Favorite" inputPlaylists={[]}/>
                    {/* {playlists.map((playlist) => (
                        <a href={`/playlist/${playlist.id}`} key={playlist.id}>
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
                    ))} */}
                </div>
            </div>

            : <Register />}
    </>)
}

export default Profile;