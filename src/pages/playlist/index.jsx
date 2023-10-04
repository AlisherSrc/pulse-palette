import styles from './playlist.module.css';


import { useParams } from 'react-router-dom';
import { db, storage } from '../../config/firebase';
import { useEffect, useRef, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Playlist = () => {
    const { id } = useParams();
    const [songs, setSongs] = useState([]);
    const refAudio = useRef(null);

    useEffect(() => {
        const docs = [];

        const getSongs = async () => {
            const q = query(collection(db, "song"), where('playlistID', '==', id));

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });

            setSongs(docs);
        }

        getSongs();
    }, []);




    return <div>
        Playlist number: {id}

        {songs.map((song) => (
            <div className={`${styles.audio_player}`} key={song.id}>
                <audio preload controls ref={refAudio}>
                    <source src={song.songFile} type="audio/mp3" />
                    Your browser does not support the audio element.
                </audio>

                {refAudio && <button onClick={() => refAudio.current.currentTime += 15}>Skip forward</button>}
                
                {refAudio && <button onClick={() => refAudio.current.currentTime -= 15}>Skip backward</button>}
                
                {refAudio && <button onClick={() => refAudio.current.pause()}>Pause</button>}

                {/* Something is wrong here, it is trying to render despite refAudio being null */}
                {/* {refAudio && `${Math.floor(refAudio.current.duration / 60)}:${Math.round(refAudio.current.duration - Math.floor(refAudio.current.duration / 60) * 60)}`} */}
            </div>
        ))}
    </div>
}

export default Playlist;