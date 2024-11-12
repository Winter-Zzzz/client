// components/SignUp.js 
import React from 'react';
import useSignUp from '../hooks/useSignUp';
import styles from './auth.module.css';

const SignUp = () => {
 const { generatedKey, message, error, handleSignUp, copyPrivateKey, clicked } = useSignUp();

 return (
   <>
   <div className={styles.container}>
     <div className={styles.signupContainer}>
       <div className={styles.signupPromptBox}>
         <h4>아직 회원이 아니신가요?</h4>
         <p>지금 회원가입하시면 다양하고 특별한 혜택이 준비되어 있습니다.</p>
         <button 
           onClick={handleSignUp}
           className={styles.signupButton}
         >
           회원가입
         </button>
       </div>

       {clicked && (
         <div className={styles.keyDisplay}>
           <p>생성된 개인 키:</p>
           <p className={styles.privateKeyText}>{generatedKey}</p>
           <button onClick={copyPrivateKey}>Copy</button>
         </div>
       )}
       
       {clicked && message && !error && (
         <p className={styles.message}>{message}</p>
       )}

       {clicked && error && (
         <p className={styles.errorMessage}>{error}</p>
       )}
     </div>
   </div>
   </>
 );
};

export default SignUp;
