import styles from './home.module.css';

import Group from '../../components/group';
import './home.module.css';
import cards from '../../database/cards';

const Home = () => {
    
    return (
        <>
            <div className={`${styles.home}`}>
                <Group title="Popular" cards={cards} numShowed={4} />
                <Group title="Latest" cards={cards} numShowed={4} />
            </div>
        </>
    )
}

export default Home;