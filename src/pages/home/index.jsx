import styles from './home.module.css';

import Group from '../../components/group';
import './home.module.css';

import useGetLatestPlaylists from '../../hooks/useGetLatestPlaylists';

const Home = () => {

   const {playlists,loading} = useGetLatestPlaylists();

    // group{
    // title:string
    // groupID:string
    // inputPlaylists
    // }
    // groups.forEach((group) => {

    //     console.log(group);
    // })
    // Need to get all playlists and filter them by public, in order to show them in the "Latest" group where all public 
    // playlists will be displayed
    return (
        <>
            <div className={`${styles.home}`}>
                {(playlists && playlists.length !== 0) ? <Group title="Latest" inputPlaylists={playlists} numShowed={4} />  : <p>Loading...</p>}
                <Group title="Popular" groupID="lci3fBjppIELL2Ttlnb2" numShowed={4} />
            </div>
        </>
    )
}

export default Home;