import { useEffect, useState } from 'react';
import Card from '../card';
import styles from './group.module.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';


// TO DO: When Group is empty, it should indicate so visually somehow

const Group = (props) => {
    // title: string;
    // cards: Card[];
    // numShowed: number; - number of cards showed 

    const [playlists, setPlaylists] = useState([]);
    const {
        title,
        numShowed,
        groupID,
        inputPlaylists,
        isUsersFavorites,
        isUsersPlaylists
    } = props;

    useEffect(() => {
        const cards = [];

        const getCards = async () => {
            console.log(inputPlaylists)

            try {
                const q = query(collection(db, "playlist"), where("groupID", "==", groupID));

                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((playlist) => {
                    cards.push({ id: playlist.id, ...playlist.data() });
                });

                setPlaylists(cards);

            } catch (error) {
                console.log(error);
            }
        }

        if (!inputPlaylists) getCards();

        else setPlaylists(inputPlaylists);
    }, []);



    return (
        <div className={styles.group}>
            <div className={styles.group_text}>
                <h3>{title}</h3>
                {isUsersPlaylists && <Link to={`/group/created`}>Show all</Link>}
                {isUsersFavorites && <Link to={`/group/favorites`}>Show all</Link>}
                {!isUsersFavorites && !isUsersPlaylists && (
                    <Link to={groupID ? `/group/${groupID}` : `/group/${title}`} className={styles.showAllLink}>Show all</Link>
                )}
            </div>

            <div className={styles.cards}>
                {playlists.length !== 0 &&
                    playlists.slice(0, numShowed).map((playlist) => (
                        <div key={playlist.id} className={styles.card_container}>
                            <Card
                                id={playlist.id}
                                imageUrl={playlist.imageUrl}
                                title={playlist.title}
                                description={playlist.description}
                            />
                        </div>
                    ))}
            </div>
        </div>)
        }

export default Group;