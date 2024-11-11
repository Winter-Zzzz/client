// hooks/useSignUp.js
import { useState } from 'react';

const useSignUp = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [clicked, setClicked] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');

  const handleSignUp = async () => {
    try {

      // 동적으로 elliptic 라이브러리 import
      const { ec } = await import('elliptic');
      // secp256k1 -> secp256r1
      const EC = new ec('p256');

      // 키 쌍 생성
      const key = EC.genKeyPair();
      const newPrivateKey = key.getPrivate('hex');
      
      // 상태 업데이트
      setGeneratedKey(newPrivateKey)
      setMessage('Sign Up Completed')
      setError(''); // 에러 메시지 초기화
      console.log('Sign Up Completed');
      setClicked(true);
    } catch (err) {
      console.error('Error during sign up:', err);
      setError('Failed to generate key pair. Please ensure all dependencies are installed.');
    }
  };

  const copyPrivateKey = async () => {
    try {
      console.log('try copyPrivateKey')
      await navigator.clipboard.writeText(generatedKey);
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
    message,
    error,
    handleSignUp,
    copyPrivateKey,
    clicked,
    generatedKey
  };
};

export default useSignUp;