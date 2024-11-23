import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './device.module.css';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.navContainer}>
      <div className={styles.navInner}>
        <button 
          className={styles.navItem} 
          onClick={() => navigate('/device')}
        >
          <img 
            src="/assets/icons/home.png" 
            alt="home" 
            className={styles.navIcon} 
          />
        </button>
        <button 
          className={styles.navItem}
        >
          <img 
            src="/assets/icons/auto.png" 
            alt="time" 
            className={styles.navIcon} 
          />
        </button>
        <button 
          className={styles.navItem}
          onClick={() => navigate('/account')}
        >
          <img 
            src="/assets/icons/account.png" 
            alt="account" 
            className={styles.navIcon} 
          />
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;