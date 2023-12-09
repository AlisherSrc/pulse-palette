import styles from './song.module.css';

import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import heart from './../../images/heart.svg';
import filledHeart from './../../images/filled_heart.svg'

import { useContext, useEffect, useState } from 'react';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Context } from '../../App';
import { useNavigate } from 'react-router-dom';

const Song = (props) => {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);

    const { customUser } = useContext(Context);

    const { song } = props;
    // Check if the song is already liked 
    useEffect(() => {

        if (customUser && customUser?.likedSongs) setLiked(customUser?.likedSongs.includes(song.id));

    }, [customUser.likedSongs, song.id])

    const handleLike = async (songId) => {
        console.log(!customUser, customUser?.likedSongs);

        if (!customUser || !Array.isArray(customUser?.likedSongs)){
            navigate('/login');
            return;
        }

        // Optimistic update
        setLiked(currentLiked => !currentLiked);

        try {
            const userRef = doc(db, 'user', customUser.id);
            let updatedLikedSongs;

            if (!liked) {
                // If currently not liked, add the song
                updatedLikedSongs = [...customUser.likedSongs, songId];
            } else {
                // If currently liked, remove the song
                updatedLikedSongs = customUser.likedSongs.filter((song) => song !== songId);
            }

            await updateDoc(userRef, { likedSongs: updatedLikedSongs });

            console.log(liked ? "Unliked!" : "Liked!");
        } catch (error) {
            console.error("Error updating liked songs:", error);
            // Optionally revert the optimistic UI update in case of error
            setLiked(currentLiked => !currentLiked);
        }
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