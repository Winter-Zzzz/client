import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = () => {
    const [inputKey, setInputKey] = useState('');
    const [message, setMessage] = useState('');

    // 16진수 인지 확인 !
    const isValidHex = (key) => {
        const hexPattern = /^[0-9a-fA-F]{64}$/;
        return hexPattern.test(key);
    };

    const handleLogin = () => {
        const storedPrivateKey = localStorage.getItem('privateKey');

        // 16 진수 아니면 포맷 잘못됐다고 알리기
        if (!isValidHex(inputKey)) {
            setMessage('Your key is incorrectly formatted');
            setInputKey('');
            return;
        }
        
        if (inputKey === storedPrivateKey) {
            setMessage('Login Completed');
            setInputKey('');
        } else {
            setMessage('Login Failed');
            setInputKey('');
        }
        
    };

    return (
        <div classname={styles.loginContainer}>
            <div className={styles.formContainer}>
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
            </div>
        </div>
    );
};

export default Login;