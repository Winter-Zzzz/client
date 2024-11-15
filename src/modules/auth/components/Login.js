// components/Login.js
import React from 'react';
import useLogin from '../hooks/useLogin';  // 훅을 가져옵니다.
import styles from './auth.module.css';
import { Link } from 'react-router-dom';

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
                {(loggedIn) && (
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
                    <div className={styles.signupPromptBox}>
                    <h4>아직 회원이 아니신가요?</h4>
                    <p>지금 회원가입하시면 다양하고 특별한 혜택이 준비되어 있습니다.</p>
                    <Link to="/signup" className={styles.signupButton}>
                        회원가입
                    </Link>
                    </div>
                </div>)}
            </div>
        </div>
        </>
    );
};

export default Login;