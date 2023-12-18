import { useContext, useEffect, useRef } from 'react';
import styles from './checkout.module.css';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Context } from '../../App';

const Checkout = ({ setShowPopup }) => {

    const {customUser,setCustomUser} = useContext(Context);

    const paypal = useRef();

    // render all functionalities 
    useEffect(() => {
        const buttons = window.paypal.Buttons({
            createOrder: async (data, actions, err) => {
                const order = await actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            description: "Create as much as you want!",
                            amount: {
                                currency_code: "USD",
                                value: 100.00
                            }
                        }
                    ]
                });
                return order;
            },
            onApprove: async (data, actions) => {
                changeToPremium();
                setCustomUser((prev) => ({...prev,subscription: true}))
                const order = await actions.order.capture();
                setShowPopup(false);
            },
            onError: (err) => {
                alert("Something went wrong. Please try again");
                console.log(err);
            }
        });

        buttons.render(paypal.current);


        return () => {
            buttons.close();
        };
    }, []);

    const changeToPremium = async () => {
        try{
            const userRef = doc(db,'user',customUser.id);

            await updateDoc(userRef,{ subscription: true });
    
            console.log("Subscription has been changed!")
        }catch(e){
            console.log(e);
        }
        
    }

    return (
        <div className={styles.checkout}>
            <div className={styles.content}>
                <div className={styles.content__text}>
                    <h1>Boost up to Premium Plan!</h1>
                    <p>Create as much playlists and songs as you want!</p>
                    <p>Only for 100$</p>
                </div>
                <div ref={paypal}></div>
                <p className={styles.notnow} onClick={() => setShowPopup(false)}>Not now</p>
            </div>
        </div>
    );
};

export default Checkout;