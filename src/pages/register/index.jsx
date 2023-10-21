import styles from './register.module.css';

import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Button from "../../components/button";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { generateRandomString } from '../../tools/generateRandomStr';
import { Link } from 'react-router-dom';

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [isPasswordShowed, setPasswordShowed] = useState(false);

    const [loading, setLoading] = useState(false);

    const [weakPasswordErr,setWeakPasswordErr] = useState(false);

    const auth = getAuth();

    const register = async (e) => {
        e.preventDefault();

        setWeakPasswordErr(false);
        setLoading(true);

        if (!username || !password || !passwordConfirm || !email) {

            setTimeout(() => setLoading(false),50);
            alert("Please, fill all the fields");
            return;
        }

        if(password.length < 8 || !/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password) || !/[A-Z]/.test(password)
        || !/[0-9]/.test(password)){
            setTimeout(() => setLoading(false),50);
            setWeakPasswordErr(true);
            return;
        }

        if(password !== passwordConfirm){
            setTimeout(() => setLoading(false),50);
            alert("Passwords are not matching")
            return;
        }


        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                
                return setDoc(doc(db, "user", `${username}${generateRandomString(16)}`),{
                    username: username,
                    email: email,
                    followers: [],
                    avatarUrl: '',
                    tokenId: auth.currentUser.getIdToken
                });
                // send user to the home page
            }).then((snapshot) => {
                console.log("User created!");
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            });
    }

    return <>
            <div className={`${styles.form_container}`}>
                <div className={`${styles.form}`}>
                    <hr />

                    <h1>Sign up and start!</h1>
                    <div className={styles.socialSignUp}>
                        {/* Social sign up */}
                    </div>
                    <form>
                        <div className={`${styles.form_block}`}>
                            <label>What should we call you?</label>
                            <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className={`${styles.form_block}`}>
                            <label>Please, provide your active email</label>
                            <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className={`${styles.form_block}`}>
                            <label>Choose a strong password</label>
                            <div className={`${styles.password}`}>
                                <input type={isPasswordShowed ? "text" : "password"} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                                <input type="button" value="show" onClick={() => setPasswordShowed(!isPasswordShowed)} />
                            </div>
                        </div>
                        <div className={`${styles.form_block}`}>
                            <label>Confirm the password</label>
                            <input type={isPasswordShowed ? "text" : "password"} placeholder="password" onChange={(e) => setPasswordConfirm(e.target.value)} />
                        </div>
                        <Button text="Sign up" color="var(--lime-green)" width="15rem" height="2.5rem" onClick={(e) => register(e)} />
                        {weakPasswordErr && <p className={`${styles.errorText}`}>Password should be at least 8 characters and numbers, has at least 1 uppercase and 1 special character</p>}
                        {loading && "Loading..."}
                    </form>
                    <hr />
                    <p>Have an account? <Link to="/login">Log in!</Link></p>
                </div>
            </div>
    </>
}

export default Register;