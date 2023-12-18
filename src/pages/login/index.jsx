import { useContext, useState } from 'react';
import Button from '../../components/button';
import { Link, useNavigate } from 'react-router-dom';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';


import styles from './login.module.css';
import { Context } from '../../App';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Login = () => {

    const [loading] = useState(false);
    const [loginLoading,setLoginLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShowed, setPasswordShowed] = useState(false);

    const {setCustomUser} = useContext(Context);

    const auth = getAuth();
    const navigate = useNavigate();

    const login = (event) => {
        event.preventDefault();
        setLoginLoading(true);
                if(!email || !password){
            setTimeout(() => setLoginLoading(false),50);
            alert("Please, fill all fields");
            return;
        }
        
        signInWithEmailAndPassword(auth,email,password)
        .then(async () => {
            const q = query(collection(db,"user"),where("email",'==',email));

            const user = await getDocs(q);

            user.forEach((user) => {
                setCustomUser({
                    id: user.id,
                    ...user.data()
                })
            });
        })
        .then(() => {
            console.log("Logged in!")
            setLoginLoading(false);
            navigate("/profile");
        }).catch((err) => {
            console.log(err);
            setLoginLoading(false);
        })
    }

    return <>
        {loading ? "Loading..." :
            <div className={`${styles.form_container}`}>
                <div className={`${styles.form}`}>
                    <h1>Log in to Pulse Palette</h1>
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
                            <label>Email</label>
                            <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className={`${styles.form_block}`}>
                            <label>Password</label>
                            <div className={`${styles.password}`}>
                                <input type={isPasswordShowed ? "text" : "password"} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                                <input type="button" value="show" onClick={() => setPasswordShowed(!isPasswordShowed)} />
                            </div>
                        </div>
                        {!loginLoading ? <Button text="Login" color="var(--lime-green)" width="15rem" height="2.5rem" onClick={(e) => login(e)} />
                        : <p>Loading...</p>}
                    </form>
                    <hr />
                    <div className={styles.haveAccount}>
                        <p>Don't have account? </p>
                        <Link to="/signup"><a href=""> Sign up!</a></Link>
                    </div>
                </div>
            </div>}
    </>
}

export default Login;