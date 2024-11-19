// hooks/useLogin.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, invalidFormat, logout } from '../states/authSlice';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
    const navigate = useNavigate();
    const [inputKey, setInputKey] = useState('');
    const dispatch = useDispatch();
    const message = useSelector((state) => state.auth.message);

    // 포맷에 맞는지 확인하는 함수 
    const isValidHex = (key) => {
        const hexPattern = /^[0-9a-fA-F]{64}$/;
        return hexPattern.test(key);
    };

    // 로그인 처리 로직
    const handleLogin = () => {

        if (!isValidHex(inputKey)) {
            dispatch(invalidFormat());
            setInputKey('');
            console.log('Invalid Format')
            return;

        } else {
            dispatch(loginSuccess(inputKey));
            localStorage.setItem('loginState', 'true');
            localStorage.setItem('privateKey', inputKey);
            console.log('Login')
            setInputKey('');
            navigate('/device');
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