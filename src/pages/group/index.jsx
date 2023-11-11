import { useEffect, useState } from 'react';
import './group.module.css';
import { useParams } from 'react-router-dom';
import styles from './group.module.css';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import useGetLatestPlaylists from '../../hooks/useGetLatestPlaylists';
import Card from '../../components/card';
import useGetUserPlaylists from '../../hooks/useGetUserPlaylists';

const Group = () => {
    const { id } = useParams();
    const [playlists, setPlaylists] = useState([]);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const { playlists: latestPlaylists, loading: loadingPlaylists, errorPlaylists } = useGetLatestPlaylists();
    const [userPlaylists,userPlaylistsLoading,error] = useGetUserPlaylists();

    useEffect(() => {
        const docs = [];

        console.log(JSON.stringify(id));

        try {

            const getDocuments = async () => {

                const q = query(collection(db, "playlist"), where("groupID", '==', id));
                setLoading(true);
                const groupDoc = await getDoc(doc(db, "group", id))
                const playlistDocs = await getDocs(q)



                playlistDocs.forEach((doc) => {
                    docs.push({ id: doc.id, ...doc.data() });
                })

                setGroup(groupDoc.data());
                setPlaylists(docs);
                setLoading(false);
            }


            // Specific cases
            if (id === "Latest") {
                setPlaylists(latestPlaylists);
                setGroup({ title: id });
                !loadingPlaylists && setLoading(false);
                console.log(latestPlaylists, loadingPlaylists);
            } else if (id === "created") {
                setPlaylists(userPlaylists);
                setGroup({title: id});
                !userPlaylistsLoading && setLoading(false);
            } else if (id === "favorites") {
                
            } else getDocuments();

        } catch (err) {
            console.log(err)
        }




    }, [latestPlaylists, id, errorPlaylists,userPlaylistsLoading]);


    return (
        <>
            {loading ? <p>Loading...</p> :

                <div className={`${styles.main}`}>
                    <div className={`${styles.groupPart}`}>
                        <img src={playlists[0].imageUrl} alt="" />
                        <div className={`${styles.groupText}`}>
                            <h1>{group.title}</h1>
                        </div>
                    </div>
                    <div className={`${styles.playlists}`}>
                        {playlists.map((playlist) => (
                            // Card component
                            <div key={playlist.id} className={`${styles.card_container}`}>
                                <Card id={playlist.id} title={playlist.title} description={playlist.description} imageUrl={playlist.imageUrl} />
                            </div>
                        ))}
                    </div>
                </div>}
        </>
    );
}

export default Group;
