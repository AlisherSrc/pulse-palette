import styles from './home.module.css';

import Group from '../../components/group';
import './home.module.css';
import cards from '../../database/cards';
import useFirestore from '../../hooks/useFirestore';
import { useEffect } from 'react';

const Home = () => {
    const [groups,loading,getCollectionList] = useFirestore("group");
    // group{
    // id:string
    // title:string
    // cards:Card[] 
    // }
    // groups.forEach((group) => {

    //     console.log(group);
    // })
    // Need to get all playlists and filter them by public, in order to show them in the "Latest" group where all public 
    // playlists will be displayed
    return (
        <>
            <div className={`${styles.home}`}>   
                {/* {!loading ? (groups.map((group) => (
                    

                    <Group key={group.id} title={group.title} numShowed={4} groupID={group.id}/>
                ))) : <b>Loading...</b>} */}

                {/* <Group title="Latest" cards={cards} numShowed={4} /> */}
            </div>
        </>
    )
}

export default Home;