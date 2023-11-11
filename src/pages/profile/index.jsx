import { useContext, useEffect, useState } from "react";
import styles from "./profile.module.css";
import Register from "../register";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Group from "../../components/group";
import { Button } from 'antd';
import { Context } from "../../App";
import useGetUserPlaylists from "../../hooks/useGetUserPlaylists";
// import { Group } from "antd/es/avatar";


const Profile = () => {
    const [isAuth, setisAuth] = useState(false);
    const [currUser, setCurrUser] = useState(null);

    const [userPlaylists,loading,error] = useGetUserPlaylists();

    // const {setUserCreatedPlaylists} = useContext(Context);

    const nav = useNavigate();

    let auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,async (user) => {
            if(user){
                setCurrUser(user);
                setisAuth(true);

                const q = query(collection(db,"user"),where("email",'==',user.email));
                const userDoc = await getDocs(q);
                userDoc.forEach((user) => {
                    console.log(user.data())
                })
            }else{
                setisAuth(false);
            }
        });

        return () => unsubscribe();
    }, [auth]);

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
                <div className={`${styles.playlists}`}>
                    {/* Still undefined when click*, address this issue by providing query or something to do with it */}
                    {!loading ? <Group isUsersPlaylists title="Created Playlists" inputPlaylists={userPlaylists} /> : "Loading"}
                    <Group isUsersFavorites title="Favorite" inputPlaylists={[]}/>
                </div>
            </div>

            : <Register />}
    </>)
}

export default Profile;