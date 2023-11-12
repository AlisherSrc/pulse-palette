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
import useTurnDocIdsIntoDocs from "../../hooks/useTurnDocIdsToDocs";
// import { Group } from "antd/es/avatar";


const Profile = () => {
    const [isAuth, setisAuth] = useState(false);
    const [currUser, setCurrUser] = useState(null);

    const [userPlaylists,loading,error] = useGetUserPlaylists();

    const {setCustomUser} = useContext(Context);

    const nav = useNavigate();

    const auth = getAuth();
    // id,imageUrl, title, description
    const likedPlaylists = {
        id: 0,
        imageUrl: "https://images.unsplash.com/photo-1569513586164-80529357ad6f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Liked Songs",
        ddescription: "Here you can see all your favorite songs!"
    }

    const [docs] = useTurnDocIdsIntoDocs([["My first auth playlist oM1Q3Chvp0Y9JXKV"],"playlist"]);
    console.log(docs);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,async (user) => {
            if(user){
                setCurrUser(user);
                setisAuth(true);

                const q = query(collection(db,"user"),where("email",'==',user.email));
                const userDoc = await getDocs(q);
                userDoc.forEach((user) => {
                    setCustomUser({id:user.id,...user.data()})
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
                    {!loading ? <Group title="All Playlists" isUsersPlaylists inputPlaylists={[likedPlaylists,...userPlaylists]} /> : "Loading"}
                    {<Group title="Favorites" isUsersFavorites />}
                </div>
            </div>

            : <Register />}
    </>)
}

export default Profile;