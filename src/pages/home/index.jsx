import styles from './home.module.css';

import Group from '../../components/group';
import './home.module.css';

import useGetLatestPlaylists from '../../hooks/useGetLatestPlaylists';

const Home = () => {

   const {playlists,loading} = useGetLatestPlaylists();

    return (
        <>
            <div className={styles.home}>
    {playlists && playlists.length !== 0 ? (
        <>
            <Group title="Latest" inputPlaylists={playlists} numShowed={4} />
            <Group title="Popular" groupID="lci3fBjppIELL2Ttlnb2" numShowed={4} />
        </>
    ) : (
        <p>Loading...</p>
    )}
</div>
        </>
    )
}

export default Home;