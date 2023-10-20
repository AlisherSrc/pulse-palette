import styles from './home.module.css';

import Group from '../../components/group';
import './home.module.css';
import cards from '../../database/cards';
import useFirestore from '../../hooks/useFirestore';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getAuth } from 'firebase/auth';

const Home = () => {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        try {

            const getPlaylists = async () => {
                const docs = [];

                // Getting all public playlists
                const q = query(collection(db, "playlist"), where("public", "==", true));

                const getQuerySnapshot = await getDocs(q);

                getQuerySnapshot.forEach((doc) => {
                    docs.push({id:doc.id,...doc.data()});
                });

                setPlaylists(docs);
            }

            getPlaylists()
        } catch (error) {
            console.log(error);
        }

        
        console.log(playlists);

    }, []);
    return (
        <>
            <div className={`${styles.home}`}>
                {(playlists && playlists.length !== 0) ? <Group title="Latest" inputPlaylists={playlists} numShowed={4} />  : <p>Loading...</p>}
                <Group title="Popular" groupID="lci3fBjppIELL2Ttlnb2" numShowed={4} />
            </div>
        </>
    )
}

export default Home;