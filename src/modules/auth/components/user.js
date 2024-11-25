import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../states/authSlice';
import styles from './auth.module.css';
import BottomNav from '../../device/components/BottomNav';

const User = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const privateKey = useSelector((state) => state.auth.privateKey);

    const handleCopyKey = async () => {
        try {
            await navigator.clipboard.writeText(privateKey);
            alert('개인키가 복사되었습니다.');
        } catch (err) {
            alert('복사에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleLogout = () => {
        // localStorage에서 관련 데이터 삭제
        localStorage.removeItem('loginState');
        localStorage.removeItem('privateKey');
        
        // Redux 상태 초기화
        dispatch(logout());
        
        // 홈으로 리다이렉트
        navigate('/');
    };

    return (
        <>
            <div className={styles.pageContainer}>
                <h2>Matter Tunnel</h2>
                <div className={styles.container}>
                    <div className={styles.loginContainer}>
                        <p>귀하의 개인키입니다.</p>
                        <div className={styles.loggedInInfo}>
                            {privateKey}
                        </div>
                        <button
                            onClick={handleCopyKey}
                            className={styles.loginButton}
                        >
                            개인키 복사
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`${styles.loginButton} ${styles.logoutButton}`}
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
            <BottomNav />
        </>
    );
};

export default User;