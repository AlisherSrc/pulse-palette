import { useParams } from 'react-router-dom';
import styles from './playlist.module.css';

const Playlist = () => {

    const {id} = useParams();

    return <div>
        Playlist number: {id}
    </div>
}

export default Playlist;