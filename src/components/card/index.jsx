import { Link } from 'react-router-dom';
import styles from './card.module.css';
import { useEffect, useState } from 'react';

const Card = (props) => {
    const { id, imageUrl, title, description } = props;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id || imageUrl || title || description) setLoading(false);
    }, [id, imageUrl, title, description]);

    // Function to truncate description to the first 15 characters
    const truncateDescription = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <>
            {loading ? (
                <div className={styles.card_container}>
                    <div className={styles.card}>Loading...</div>
                </div>
            ) : (
                <div className={styles.card_container_container}>
                    <Link to={`/playlist/${id}`} className={styles.card_container}>
                        <div className={styles.card}>
                            <div className={styles.img_container}>
                                <img src={imageUrl} alt={title} className={styles.card_image} />
                            </div>
                            <div className={styles.card_text_container}>
                                <div className={styles.card_text}>
                                    <p className={styles.card_title}>{title}</p>
                                    <p className={styles.card_description}>
                                        {truncateDescription(description, 20)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </>
    );
};

export default Card;
