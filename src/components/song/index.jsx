import styles from './song.module.css';

import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import heart from './../../images/heart.svg';
import filledHeart from './../../images/filled_heart.svg'

import { useState } from 'react';

const Song = (props) => {
    const [liked,setLiked] = useState(false);

    const { song } = props;


    const handleLike = () => {
        console.log(liked);
        setLiked(!liked);
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
            <img className={styles.heart_icon} onClick={handleLike} src={liked ? filledHeart : heart} />
        </div>
    </>
}

export default Song;