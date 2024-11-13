// components/Login.js
import React from 'react';
import useLogin from '../hooks/useLogin';  // 훅을 가져옵니다.
import styles from './auth.module.css';

const Login = () => {
    const { inputKey, message, setInputKey, handleLogin } = useLogin();  // 훅에서 상태와 함수 가져오기
    const loggedInKey = localStorage.getItem('privateKey');
    console.log(loggedInKey);
    const loggedIn = localStorage.getItem('loginState');
    return (
        <>
        <div className={styles.container}>
        <h2>Matter Tunnel</h2>
            <div className={styles.loginContainer}>
                <span className={styles.keyLabel}>현재 로그인 중인 개인키</span>
                {(loggedIn) && (
                    <div className={styles.loggedInInfo}>
                        {loggedInKey}
                    </div>
                )}
                {(<div className={styles.formContainer}>
                    <input 
                        type="text"
                        placeholder="개인 키를 입력하세요"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}  // 입력값 변경 처리
                        className={styles.inputField}
                    />
                    <button 
                        onClick={handleLogin}  // 로그인 버튼 클릭 시 처리
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
        </>
    );
};

export default Login;