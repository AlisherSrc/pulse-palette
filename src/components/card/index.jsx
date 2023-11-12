import { Link } from 'react-router-dom';
import styles from './card.module.css';
import { useEffect, useState } from 'react';
import heart from '../../images/heart.svg';

const Card = (props) => {
    const { id, imageUrl, title, description } = props;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id || imageUrl || title || description) setLoading(false);
    }, [id, imageUrl, title, description]);

    return (
        <>
            {loading ?
                <div className={`${styles.card_container}`}>
                    <div className={`${styles.card}`}>
                        Loading...
                    </div>
                </div>
                :
                <div className={`${styles.card_container_container}`}>
                    <Link to={`/playlist/${id}`} className={`${styles.card_container}`}>
                        <div className={`${styles.card}`}>
                            <div className={`${styles.img_container}`}>
                                <img src={imageUrl} />
                            </div>
                            <div className={`${styles.card_text_container}`}>
                                <div className={`${styles.card_text}`}>
                                    <h2>{title}</h2>
                                    <h3>{description}</h3>
                                </div>
                            </div>
                        </div>
                    </Link>
                    {/* <img src={heart} alt='like' className={`${styles.like_icon}`} /> */}
                </div>}
        </>
    )
}

export default Card;