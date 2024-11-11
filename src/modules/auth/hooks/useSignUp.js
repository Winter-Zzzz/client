// hooks/useSignUp.js
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPrivateKey } from '../states/authSlice';

const useSignUp = () => {
  const privateKey = useSelector((state) => state.auth.privateKey);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    try {
      // 기존 개인 키 삭제 
      localStorage.removeItem('privateKey');

      // 동적으로 elliptic 라이브러리 import
      const { ec } = await import('elliptic');
      // secp256k1 -> secp256r1
      const EC = new ec('p256');

      // 키 쌍 생성
      const key = EC.genKeyPair();
      const newPrivateKey = key.getPrivate('hex');
      
      // 로컬 스토리지에 개인 키 저장
      localStorage.setItem('privateKey', newPrivateKey);

      // 잘 저장되었는지 확인
      const storedKey = localStorage.getItem('privateKey')
      console.log('Privatekey in Local Storage', storedKey)
      
      // 상태 업데이트
      dispatch(setPrivateKey(newPrivateKey));
      setMessage('Sign Up Completed. Your private key has been saved in local storage');
      setError(''); // 에러 메시지 초기화
      
      console.log('Sign Up Completed');
      setClicked(true);
    } catch (err) {
      console.error('Error during sign up:', err);
      setError('Failed to generate key pair. Please ensure all dependencies are installed.');
    }
  };

  const copyPrivateKey = async () => {
    if (!privateKey) {
      setError('개인 키가 스토리지에 존재하지 않습니다.');
      return;
    }
    try {
      console.log('try copyPrivateKey')
      await navigator.clipboard.writeText(privateKey);
      setMessage('개인 키가 클립보드에 복사되었습니다!');
      console.log('Privatekey Successfully Copied')
      // 3초 후에 메시지를 지움
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      setError('클립보드 복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
    privateKey,
    message,
    error,
    handleSignUp,
    copyPrivateKey,
    clicked,
  };
};

export default useSignUp;