import { useEffect, useState } from 'react';
import './group.module.css';
import { useParams } from 'react-router-dom';
import data from '../../database/cards';
import styles from './group.module.css';

function Group(props) {
    const { id } = useParams();
    const [playlists, setPlaylists] = useState([]);
    const group = data.groups.find((group) => group.id === Number(id));

    useEffect(() => {
        const docs = data.playlists.filter((playlist) => playlist.groupId === Number(id));
        setPlaylists(docs);
    }, [id]);

    if (!group) {
        return <div>Группа не найдена</div>;
    }

    return (
        <>
            <div className={`${styles.groupPart}`}>
            <img src={group.imageUrl} alt="" />
                <div className={`${styles.groupText}`}>
                    <h1>{group.title}</h1>
                    <h3>{group.subtitle}</h3>
                </div>
            </div>
            <div className={`${styles.playlists}`}>
                {playlists.map((playlist) => (
                    <div className={`${styles.playlist}`} key={playlist.id}>
                        <img src={playlist.imageUrl} alt="" />
                        <div className={`${styles.playlistTitle}`}>
                            <h4>{playlist.title}</h4>
                            </div>
                        <div className={`${styles.playlistSubtitle}`}>
                            <p>{playlist.subtitle}</p>
                            </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Group;
