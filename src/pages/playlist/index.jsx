import styles from './playlist.module.css';
import { useParams } from 'react-router-dom';
import { db, storage } from '../../config/firebase';
import { useEffect, useRef, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';

import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { getAuth } from 'firebase/auth';
import heart from '../../images/heart.svg';
import Song from '../../components/song';

const Playlist = () => {
    const { id } = useParams();
    const [songs, setSongs] = useState([]);
    const refAudio = useRef(null);
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currUser, setCurrUser] = useState(null);

    const auth = getAuth();

    useEffect(() => {
        if (auth.currentUser) {
            setCurrUser(auth.currentUser);
        } else console.log("Not auth")
    }, [auth])

    useEffect(() => {
        const docs = [];

        const getSongs = async () => {
            const q = query(collection(db, "song"), where('playlistID', '==', id));
            const playlistDoc = await getDoc(doc(db, "playlist", id))
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });

            setSongs(docs);
            setPlaylist({ id: playlistDoc.id, ...playlistDoc.data() });
            setLoading(false);

        }
        // Check if the playlist is specific cased

        
        getSongs();

    }, []);




    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className={styles.main}>
                    <div className={styles.playlistPart}>
                        <img src={songs[0].image} alt="" className={styles.playlistImage} />
                        <div className={styles.playlistText}>
                            <h1>Title: {playlist.title}</h1>
                            <h3>Description: {playlist.description}</h3>
                            {currUser?.email === playlist?.userEmail && <Link to={`/playlist/${playlist.id}/edit`}><button className={`${styles.button_68}`} role="button">Edit</button></Link>}
                        </div>
                    </div>
                    <hr className={styles.horizontalLine} />

                    <div className={styles.audioList}>
                        {songs.map((song, index) => (
                            <div key={song.id}>
                                <Song song={song} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>

    )
}

export default Playlist;