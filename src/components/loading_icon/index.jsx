import styles from './loading.module.css';
import ripple from './../../images/ripple-1s-200px.svg';

const LoadingIcon = () => {

    return <>
        <div className={`${styles.loading_icon}`}>
            <img src={ripple} alt='loading' />
        </div>
    </>
}

export default LoadingIcon;