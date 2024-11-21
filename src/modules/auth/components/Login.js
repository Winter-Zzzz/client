// components/Login.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import styles from './auth.module.css';

const Login = () => {
    const navigate = useNavigate();
    const { inputKey, message, setInputKey, handleLogin } = useLogin();
    const loggedInKey = localStorage.getItem('privateKey');
    const loggedIn = localStorage.getItem('loginState');

    useEffect(() => {
        if (loggedIn) {
            navigate('/device');
        }
    }, [navigate, loggedIn]);

    return (
        <div className={styles.pageContainer}>
            <h2>Matter Tunnel</h2>
            <div className={styles.container}>
                <div className={styles.loginContainer}>
                    {loggedIn && (
                        <>
                            <span className={styles.keyLabel}>현재 로그인 중인 개인키</span>
                            <div className={styles.loggedInInfo}>
                                {loggedInKey}
                            </div>
                        </>
                    )}
                    {(<div className={styles.formContainer}>
                        <input 
                            type="text"
                            placeholder="개인 키를 입력하세요"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            className={styles.inputField}
                        />
                        <button
                            onClick={handleLogin}
                            className={styles.loginButton}
                        >
                            로그인
                        </button>
                        
                        {message && (
                            <p className={`${styles.message} ${
                                message === 'Login Completed'
                                    ? styles.successMessage
                                    : styles.errorMessage
                            }`}>
                                {message}
                            </p>
                        )}
                    </div>)}
                </div>
            </div>
        </div>
    );
};

export default Login;