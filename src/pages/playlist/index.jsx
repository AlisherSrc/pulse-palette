import styles from './playlist.module.css';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebase';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import 'react-h5-audio-player/lib/styles.css';
import { getAuth } from 'firebase/auth';
import Song from '../../components/song';
import useGetUserLikedDocs from '../../hooks/useGetUserLikedSongs';
import ShareButton from '../../components/share_button';
import LoadingIcon from '../../components/loading_icon';


const Playlist = () => {
    const { id } = useParams();
    const [songs, setSongs] = useState([]);
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currUser, setCurrUser] = useState(null);


    const auth = getAuth();
    const [likedSongs, likedSongsLoading] = useGetUserLikedDocs("song");

    useEffect(() => {
        if (auth.currentUser) {
            setCurrUser(auth.currentUser);
        } else {
            // navigate("/login");
        }
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

        if (id === 'liked') {
            setPlaylist({ title: "Your liked songs!", description: "There are songs that you like", email: auth.currentUser.email })
            if (!likedSongsLoading) {
                setSongs(likedSongs);
                setLoading(false);
            }
        }
        else getSongs();

    }, [likedSongs, currUser, likedSongsLoading, id]);




    return (
        <>
            {loading ? (
                <LoadingIcon />
            ) : (
                <div className={styles.main}>
                    <div className={styles.playlistPart}>
                        <div className={`${styles.image_container}`}>
                            <img src={songs[0]?.image ?? "https://images.unsplash.com/photo-1569513586164-80529357ad6f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="" className={styles.playlistImage} />
                        </div>
                        <div className={styles.playlistText}>
                            <h1>{playlist.title}</h1>
                            <h3>{playlist.description}</h3>
                            {currUser && currUser.email === playlist?.userEmail && (
                                <Link to={`/playlist/${playlist.id}/edit`}>
                                    <button className={`${styles.button_68}`} role="button">Edit</button>
                                </Link>
                            )}
                            <ShareButton msgtitle={`${playlist.title}`} msgdescription={`${playlist.description}`} />
                        </div>
                    </div>
                    <hr className={styles.horizontalLine} />

                    <div className={styles.audioList}>
                        {songs.length === 0 && <p>Your playlist is empty!</p>}
                        {songs.map((song) => (
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