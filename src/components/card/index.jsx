import { Link } from 'react-router-dom';
import styles from './card.module.css';

const Card = (props) => {
    const { id,imageUrl, title, description } = props;

    return (
        <Link to={`/playlist/${id}`} className={`${styles.card_container}`}>
            <div className={`${styles.card}`}>
                <div className={`${styles.img_container}`}>
                    <img src={imageUrl} />
                </div>
                <h2>{title}</h2>
                <h3>{description}</h3>
            </div>
        </Link>
    )
}

export default Card;