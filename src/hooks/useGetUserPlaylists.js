import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";


const useGetUserPlaylists = () => {
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currUser, setCurrUser] = useState(null);

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrUser(user);
            }
        })

        return () => unsubscribe();
    }, [auth]);


    useEffect(() => {
        try {
            const getPlaylists = async () => {
                if (currUser) {
                    const res = [];
                    const q = query(collection(db, "playlist"), where("userEmail", '==', currUser.email));
                    setLoading(true);
                    const docs = await getDocs(q);

                    docs.forEach((playlistDoc) => {
                        res.push({ id: playlistDoc.id, ...playlistDoc.data() });
                    })
                    setUserPlaylists(res);
                    setLoading(false);
                }

            }

            getPlaylists();

        }
        catch(err){
            console.log(err);
            setError(err);
        }

        
    }, [currUser])

    return [userPlaylists,loading,error];
}

export default useGetUserPlaylists;