// components/SignUp.js
import React from 'react';
import useSignUp from '../hooks/useSignUp';  // 훅을 가져옵니다.
import styles from './SignUp.module.css';

const SignUp = () => {
  const { privateKey, message, error, handleSignUp, copyPrivateKey } = useSignUp();  // 훅에서 상태와 함수 가져오기

  return (
    <>   
    <div className={styles.signupContainer}>
    <h4>아직 회원이 아니신가요?</h4>
    <p>지금 회원가입하시면 다양하고 특별한 혜택이 준비되어 있습니다.</p>
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
          <button onClick={copyPrivateKey}>Copy</button>
        </div>
      )}
      
      {message && !error && (
        <p className={styles.message}>{message}</p>
      )}

      {error && (
        <p className={styles.errorMessage}>{error}</p>
      )}
    </div>
    </>
  );
};

export default SignUp;
