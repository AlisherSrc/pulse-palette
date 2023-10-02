import styles from './home.module.css';

import Group from '../../components/group';
import './home.module.css';
import cards from '../../database/cards';
import useFirestore from '../../hooks/useFirestore';
import { useEffect } from 'react';

const Home = () => {
    const {collectionList: groups,loading: loadingGroups} = useFirestore("group");

    groups.forEach((group) => {
        console.log(group);
    })
    

    return (
        <>
            <div className={`${styles.home}`}>   
                {/* {!loadingGroups ? (groups.map((group) => (
                    <Group key={group.id} title={group.title} cards={group.playlists} numShowed={4}/>
                ))) : <b>Loading...</b>} */}

                <Group title="Latest" cards={cards} numShowed={4} />
            </div>
        </>
    )
}

export default Home;