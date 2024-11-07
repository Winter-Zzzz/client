// hooks/useLogin.js
import { useState } from 'react';

const useLogin = () => {
    const [inputKey, setInputKey] = useState('');
    const [message, setMessage] = useState('');

    // 16진수인지 확인하는 함수
    const isValidHex = (key) => {
        const hexPattern = /^[0-9a-fA-F]{64}$/;
        return hexPattern.test(key);
    };

    // 로그인 처리 로직
    const handleLogin = () => {
        const storedPrivateKey = localStorage.getItem('privateKey');

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

    return {
        inputKey,
        message,
        setInputKey,
        handleLogin,
    };
};

export default useLogin;
