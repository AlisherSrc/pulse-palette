import styles from './register.module.css';

import { useContext, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Button from "../../components/button";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { generateRandomString } from '../../tools/generateRandomStr';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../App';

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [isPasswordShowed, setPasswordShowed] = useState(false);

    const [loading, setLoading] = useState(false);

    const [weakPasswordErr, setWeakPasswordErr] = useState(false);

    const { setCustomUser } = useContext(Context);

    const auth = getAuth();

    const register = async (e) => {
        e.preventDefault();

        setWeakPasswordErr(false);
        setLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!username || !password || !passwordConfirm || !email) {
            setTimeout(() => setLoading(false), 50);
            alert("Please, fill all the fields");
            return;
        }

        if (password.length < 8 || !/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password) || !/[A-Z]/.test(password)
            || !/[0-9]/.test(password)) {
            setTimeout(() => setLoading(false), 50);
            setWeakPasswordErr(true);
            return;
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            setTimeout(() => setLoading(false), 50);
            alert("Please enter a valid email address");
            return;
        }

        if (password !== passwordConfirm) {
            setTimeout(() => setLoading(false), 50);
            alert("Passwords are not matching");
            return;
        }

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);

                // Set custom user to use it throughout the app
                setCustomUser({
                    username: username,
                    email: email,
                    followers: [],
                    likedSongs: [],
                    favoritePlaylists: [],
                    avatarUrl: ''
                });

                return setDoc(doc(db, "user", `${username}${generateRandomString(16)}`), {
                    username: username,
                    email: email,
                    followers: [],
                    likedSongs: [],
                    favoritePlaylists: [],
                    avatarUrl: '',
                    subscription: false
                });
                // send user to the home page
            }).then((snapshot) => {
                console.log("User created!");
                navigate("/");
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
                <h1>Start for free</h1>
                {/* <div className={styles.google}>
                    <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" width="20px" alt="" />
                    <h3>Sign up with Google</h3>
                </div>
                <div className={styles.google}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/archive/b/b8/20220821121038%212021_Facebook_icon.svg/120px-2021_Facebook_icon.svg.png" width="20px" alt="" />
                    <h3>Sign up with Facebook</h3>
                </div> */}
                <hr />
                <div className={styles.socialSignUp}>
                    {/* Social sign up */}
                </div>
                <form>
                    <div className={`${styles.form_block}`}>
                        <label>What should we call you?</label>
                        <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className={`${styles.form_block}`}>
                        <label>Email</label>
                        <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={`${styles.form_block}`}>
                        <label>Password</label>
                        <div className={`${styles.password}`}>
                            <input type={isPasswordShowed ? "text" : "password"} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                            <input type='button' onClick={() => setPasswordShowed(!isPasswordShowed)} value="Show"/>
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
                <div className={styles.haveAccount}>
                <p>Have an account? </p>
                <Link to="/login"><a href="">Log in!</a></Link>
                </div>
            </div>
        </div>
    </>
}

export default Register;