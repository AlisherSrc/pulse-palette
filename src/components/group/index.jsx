import { useEffect, useState } from 'react';
import Card from '../card';
import styles from './group.module.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Group = (props) => {
// title: string;
// cards: Card[];
// numShowed: number; - number of cards showed 

    const [playlists,setPlaylists] = useState([]);

    const {
        title,
        numShowed,
        groupID
    } = props;

    useEffect(() => {
        const cards = [];

        const getCards = async () => {
            try {
                const q = query(collection(db,"playlist"), where("groupID","==",groupID));

                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((playlist) => {
                    cards.push({id:playlist.id,...playlist.data()});
                });

                setPlaylists(cards);

            } catch (error) {
                console.log(error);
            }
        }

        getCards();
    },[]);
    
    

    return (
        <div className={`${styles.group}`}>
            <div className={`${styles.group_text}`}>
                <h2>{title}:</h2>
                <p>show all</p>
            </div>

            <div className={`${styles.cards}`}>
                {playlists.length !== 0 && playlists.slice(0,numShowed).map((playlist) => (
                    <Card id={playlist.id}
                    imageUrl={playlist.imageUrl} 
                    title={playlist.title}
                    description={playlist.description}
                    key={playlist.id}
                    />
                ))} 

                {/* <Card imageUrl="https://i.pinimg.com/564x/2c/5f/0f/2c5f0f4d8cf86b6fed0a895462a93e92.jpg"
                    title="Soft Rock"
                    description="Music characterized by its gentle melodies, smooth harmonies, and emotionally-driven lyrics."
                /> */}
            </div>
        </div>)
}

export default Group;