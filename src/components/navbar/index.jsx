import styles from './navbar.module.css';
import logo from './../../images/logo.svg';

const Navbar = () => {
    return (<nav className={`${styles.navbar_section}`}>
        <img src={logo} alt='logo'/>
    </nav>)
}

export default Navbar;