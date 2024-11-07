// components/SignUp.js
import React from 'react';
import useSignUp from '../hooks/useSignUp';  // 훅을 가져옵니다.
import styles from './SignUp.module.css';

const SignUp = () => {
  const { privateKey, message, error, handleSignUp } = useSignUp();  // 훅에서 상태와 함수 가져오기

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
