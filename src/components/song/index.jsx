import styles from './song.module.css';

import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import heart from './../../images/heart.svg';
import filledHeart from './../../images/filled_heart.svg'

import { useContext, useState } from 'react';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Context } from '../../App';

const Song = (props) => {
    const [liked,setLiked] = useState(false);

    const {customUser} = useContext(Context);

    const { song } = props;


    const handleLike = async (songId) => {
        console.log(songId);
        setLiked(!liked);

  
        const q = query(collection(db,'user'),where('email','==',customUser.email));
        const documents = await getDocs(q);

        let user = null;

        documents.forEach((doc) => {
            user = {
                id: doc.id,
                ...doc.data()
            }
        })

        const userRef = doc(db,'user',user.id);

        await updateDoc(userRef,{
            likedSongs: [...customUser.likedSongs,songId]
        })

        console.log("Liked!");
    }

    return <>
        <div className={styles.audio_player} key={song.id}>
            <img src={song.image} alt="" className={styles.songImage} />
            <div className={styles.audioManage}>
                <H5AudioPlayer
                    className={styles.audioPlayer}
                    src={song.songFile}
                    customVolumeControls={[]}
                />
            </div>
            <div className={styles.songInfo}>
                <h3>Name: {song.name}</h3>
                <h4>Singer: {song.singer}</h4>
            </div>
            <img className={styles.heart_icon} onClick={() => handleLike(song.id)} src={liked ? filledHeart : heart} />
        </div>
    </>
}

export default Song;