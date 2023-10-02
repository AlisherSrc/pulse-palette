import styles from './playlist.module.css';


import { useParams } from 'react-router-dom';
import { storage } from '../../config/firebase';

const Playlist = () => {
    const { id } = useParams();
    



    return <div>
        Playlist number: {id}
        <div className={`${styles.audio_player}`}>
            <audio id="audio" controls>
                <source src="https://firebasestorage.googleapis.com/v0/b/pulse-palette-f1982.appspot.com/o/God%20knows%20The%20Melancholy%20of%20Haruhi%20Suzumiya%20Kadokawa%20MAD.mp3?alt=media&token=3ffed828-76ef-4dd3-bb89-09b4427af1c6" type="audio/mp3" />
                    Your browser does not support the audio element.
            </audio>
        </div>
    </div>
}

export default Playlist;