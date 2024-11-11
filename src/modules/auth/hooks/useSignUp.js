// hooks/useSignUp.js
import { useState } from 'react';

const useSignUp = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      // 동적으로 elliptic 라이브러리 import
      const { ec } = await import('elliptic');
      // secp256k1 -> secp256r1
      const EC = new ec('p256');

      // 키 쌍 생성
      const key = EC.genKeyPair();
      const newPrivateKey = key.getPrivate('hex');
      
      // 로컬 스토리지에 개인 키 저장
      localStorage.setItem('privateKey', newPrivateKey);
      
      // 상태 업데이트
      setPrivateKey(newPrivateKey);
      setMessage('Sign Up Completed. Your private key has been saved in local storage');
      setError(''); // 에러 메시지 초기화
      
      console.log('Sign Up Completed');
    } catch (err) {
      console.error('Error during sign up:', err);
      setError('Failed to generate key pair. Please ensure all dependencies are installed.');
    }
  };

  const copyPrivateKey = async () => {
    try {
      await navigator.clipboard.writeText(privateKey);
      setMessage('개인 키가 클립보드에 복사되었습니다!');
      
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
  };
};

export default useSignUp;