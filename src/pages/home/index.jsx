import styles from './home.module.css';

import Group from '../../components/group';
import './home.module.css';

import useGetLatestPlaylists from '../../hooks/useGetLatestPlaylists';
import { useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Context } from '../../App';
import { db } from '../../config/firebase';

const Home = () => {
    const auth = getAuth();
    const { setCustomUser } = useContext(Context);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(db, "user"), where("email", '==', user.email));
                const userDoc = await getDocs(q);
                userDoc.forEach((user) => {
                    setCustomUser({ id: user.id, ...user.data() })
                })
            }
        });

        return () => unsubscribe();
    }, [auth]);

   const {playlists,loading} = useGetLatestPlaylists();

    return (
        <>
            <div className={styles.home}>
    {playlists && playlists.length !== 0 ? (
        <>
            <Group title="Latest" inputPlaylists={playlists} numShowed={4} />
            <Group title="Popular" groupID="lci3fBjppIELL2Ttlnb2" numShowed={4} />
        </>
    ) : (
        <p>Loading...</p>
    )}
</div>
        </>
    )
}

export default Home;