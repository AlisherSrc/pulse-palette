import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const useGetLatestPlaylists = () => {

    const [playlists, setPlaylists] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
        try {

            const getPlaylists = async () => {

                const docs = [];

                // Getting all public playlists
                const q = query(collection(db, "playlist"), where("public", "==", true));

                setLoading(true);
                const getQuerySnapshot = await getDocs(q);

                getQuerySnapshot.forEach((doc) => {
                    docs.push({id:doc.id,...doc.data()});
                });

                setPlaylists(docs);
                setLoading(false);
            }

            getPlaylists()
        } catch (error) {
            console.log(error);
            setError(error);
            setLoading(false);
        }

        
        console.log(playlists);

    }, []);


    return {playlists,loading,error};
}

export default useGetLatestPlaylists;