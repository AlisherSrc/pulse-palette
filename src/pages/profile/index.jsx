import { useEffect, useState } from "react";
import styles from "./profile.module.css";
import Register from "../register";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [isAuth, setisAuth] = useState(false);
    const [currUser, setCurrUser] = useState(null);

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


    const signOut = () => {

        auth.signOut().then(() => {
            nav("/");
        }).catch((err) => console.log(err));
    }

    return (<>
        {isAuth ?
            <div>
                <p>`profile of the user: ${currUser.email}`</p>
                <button onClick={signOut}>Sign Out</button>
            </div>
            : <Register />}
    </>)
}

export default Profile;