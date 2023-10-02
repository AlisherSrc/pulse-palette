import Card from '../card';
import styles from './group.module.css';

const Group = (props) => {
// title: string;
// cards: Card[];
// numShowed: number; - number of cards showed 

    const {
        title,
        cards,
        numShowed
    } = props;



    return (
        <div className={`${styles.group}`}>
            <div className={`${styles.group_text}`}>
                <h2>{title}:</h2>
                <p>show all</p>
            </div>

            <div className={`${styles.cards}`}>
                {cards.slice(0,numShowed).map((card) => (
                    <Card id={card.id}
                    imageUrl={card.imageUrl} 
                    title={card.title}
                    description={card.description}
                    key={card.id}
                    />
                ))} 

                {/* <Card imageUrl="https://i.pinimg.com/564x/2c/5f/0f/2c5f0f4d8cf86b6fed0a895462a93e92.jpg"
                    title="Soft Rock"
                    description="Music characterized by its gentle melodies, smooth harmonies, and emotionally-driven lyrics."
                /> */}
            </div>
        </div>)
}

export default Group;