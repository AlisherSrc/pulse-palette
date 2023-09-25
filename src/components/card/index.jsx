import styles from './card.module.css';

const Card = (props) => {
    const { imageUrl, title, description } = props;

    return (
        <div className={`${styles.card}`}>
            <div className={`${styles.img_container}`}>
                <img src={imageUrl} />
            </div>
            <h2>{title}</h2>
            <h3>{description}</h3>
        </div>
    )
}

export default Card;