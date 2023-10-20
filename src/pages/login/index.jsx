import { useState } from 'react';
import Button from '../../components/button';
import { Link } from 'react-router-dom';

import styles from './login.module.css';

const Login = () => {

    const [loading,setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShowed, setPasswordShowed] = useState(false);

    const login = () => {
    }

    return <>
        {loading ? "Loading..." :
            <div className={`${styles.form_container}`}>
                <div className={`${styles.form}`}>
                    <hr />

                    <h1>Sign up and start!</h1>
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
                        <Button text="Sign up" color="var(--lime-green)" width="15rem" height="2.5rem" onClick={() => login} />
                    </form>
                    <hr />
                    <p>Don't have an account? <Link to="/signup">Sign up!</Link></p>
                </div>
            </div>}
    </>
}

export default Login;