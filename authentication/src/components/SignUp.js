import React, { useState } from 'react';
import styles from './SignUp.module.css';

const SignUp = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      // 동적으로 elliptic 라이브러리 import
      const { ec } = await import('elliptic');
      const EC = new ec('secp256k1');

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

  return (
    <div className={styles.signupContainer}>
      <button 
        onClick={handleSignUp}
        className={styles.signupButton}
      >
        회원가입
      </button>

      {privateKey && (
        <div className={styles.keyDisplay}>
          <p>생성된 개인 키:</p>
          <p className={styles.privateKeyText}>{privateKey}</p>
        </div>
      )}
      
      {message && !error && (
        <p className={styles.message}>{message}</p>
      )}

      {error && (
        <p className={styles.errorMessage}>{error}</p>
      )}
    </div>
  );
};

export default SignUp;