import styles from './playlist.module.css';
import {StepBackwardOutlined ,StepForwardOutlined ,PauseOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { db, storage } from '../../config/firebase';
import { useEffect, useRef, useState } from 'react';
import { collection, doc,getDoc,getDocs, query, where } from 'firebase/firestore';

const Playlist = () => {
    const { id } = useParams();
    const [songs, setSongs] = useState([]);
    const refAudio = useRef(null);
    const [playlist,setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docs = [];

        const getSongs = async () => {
            const q = query(collection(db, "song"), where('playlistID', '==', id));
            const playlistDoc = await getDoc(doc(db,"playlist",id))
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });

            setSongs(docs);
            setPlaylist(playlistDoc.data());
            setLoading(false);

        }

        getSongs();
        
    }, []);




    return(
        <>
            {loading ? <p>Loading...</p> :
            <div>
            <div className={`${styles.playlistPart}`}>
                <img src={songs[0].image} alt="" />
                <div className={`${styles.playlistText}`}>
                    <h1>Title : {playlist.title}</h1>
                    <h3>Description : {playlist.description}</h3>
                </div>
            </div>
            <div className={`${styles.audioList}`}>
                {songs.map((song,index) => (
                <div className={`${styles.audio_player}`} key={song.id}>
                    <h1>{index+1}</h1>
                    <img src={song.image} alt="" />
                    <div className={`${styles.audioManage}`}>
                        <audio preload controls ref={refAudio}>
                            <source src={song.songFile} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                        <div className={`${styles.manage}`}>
                            {refAudio && <StepBackwardOutlined onClick={() => refAudio.current.currentTime -= 15}/>}
                            {refAudio && <PauseOutlined onClick={() => refAudio.current.pause()}/> }
                            {refAudio && <StepForwardOutlined onClick={() => refAudio.current.currentTime += 15}/> }
                        </div>
                    </div>
                    <div className={`${styles.songInfo}`}>
                        <h2>Name : {song.name}</h2>
                        <h3>Singer : {song.singer}</h3>
                    </div>
                    

                    {/* Something is wrong here, it is trying to render despite refAudio being null */}
                    {/* {refAudio && `${Math.floor(refAudio.current.duration / 60)}:${Math.round(refAudio.current.duration - Math.floor(refAudio.current.duration / 60) * 60)}`} */}
                </div>
            ))}
            </div>
        </div>}
        </>        
    )
}

export default Playlist;