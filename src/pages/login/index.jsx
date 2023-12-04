import { useState } from 'react';
import Button from '../../components/button';
import { Link, useNavigate } from 'react-router-dom';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';


import styles from './login.module.css';

const Login = () => {

    const [loading,setLoading] = useState(false);
    const [loginLoading,setLoginLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShowed, setPasswordShowed] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    const login = (event) => {
        event.preventDefault();
        setLoginLoading(true);
        
        console.log(email,password);
        if(!email || !password){
            setTimeout(() => setLoginLoading(false),50);
            alert("Please, fill all fields");
            return;
        }
        
        signInWithEmailAndPassword(auth,email,password).then((userCred) => {
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
                    <hr />

                    <h1>Login</h1>
                    <div className={styles.socialSignUp}>
                        {/* Social sign up */}
                    </div>
                    <form>
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
                        {!loginLoading ? <Button text="Login" color="var(--lime-green)" width="15rem" height="2.5rem" onClick={(e) => login(e)} />
                        : <p>Loading...</p>}
                    </form>
                    <hr />
                    <p>Don't have an account? <Link to="/signup">Sign up!</Link></p>
                </div>
            </div>}
    </>
}

export default Login;