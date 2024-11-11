// hooks/useLogin.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFail, invalidFormat, logout } from '../states/authSlice';

const useLogin = () => {
    const [inputKey, setInputKey] = useState('');
    const dispatch = useDispatch();
    const message = useSelector((state) => state.auth.message);

    // 16진수인지 확인하는 함수
    const isValidHex = (key) => {
        const hexPattern = /^[0-9a-fA-F]{64}$/;
        return hexPattern.test(key);
    };

    // 로그인 처리 로직
    const handleLogin = () => {
        const storedPrivateKey = localStorage.getItem('privateKey');

        if (!isValidHex(inputKey)) {
            dispatch(invalidFormat());
            setInputKey('');
            console.log('Invalid Format')
            return;
        }
        
        if (inputKey === storedPrivateKey) {
            dispatch(loginSuccess({ privateKey: inputKey }));
            setInputKey('');
            console.log('Login Success')
        } else {
            dispatch(loginFail());
            setInputKey('');
            console.log('Login Fail')
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
