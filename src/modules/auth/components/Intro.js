import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './auth.module.css';

const Intro = () => {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [tutorialStep, setTutorialStep] = useState(0);
  const navigate = useNavigate();
  
  const tutorials = [
    {
      title: "Matter Tunnel에 오신걸 환영합니다!",
      subtitle: "Matter Tunnel에 대해 알아볼까요 ?",
      image: "/assets/matter-tunnel-logo.png"
    },
    {
      title: "허브 없이 바로 시작 !",
      subtitle: "블록체인을 통해 가상화된 허브를 경험하세요",
      image: "/assets/tutorial1.png"
    },
    {
      title: "더 자유롭게, 더 스마트하게",
      subtitle: "QR 코드로 기기의 모든 기능을 자유롭게 제어하세요",
      image: "/assets/tutorial2.png"
    }
  ];

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setCurrentScreen('tutorial');
    }, 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleNext = () => {
    if (tutorialStep < tutorials.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      window.location.href = '/auth';
    }
  };

  const handleSkip = () => {
    window.location.href = '/auth';
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.introContainer}>
        <AnimatePresence mode="wait">
          {currentScreen === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.introContent}
            >
              <motion.img
                src="/assets/matter-tunnel-logo.png"
                alt="Matter Tunnel Logo"
                className={styles.introLogo}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={styles.introMainTitle}
              >
                Matter Tunnel
              </motion.div>
            </motion.div>
          )}

          {currentScreen === 'tutorial' && (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.introContent}
            >
              <div className={styles.introContentWrapper}>
                <img
                  src={tutorials[tutorialStep].image}
                  alt={`Tutorial step ${tutorialStep + 1}`}
                  className={styles.introTutorialImage}
                />
                <div>
                  <h2 className={styles.introTitle}>{tutorials[tutorialStep].title}</h2>
                  <p className={styles.introSubtitle}>{tutorials[tutorialStep].subtitle}</p>
                </div>
              </div>
              
              <div className={styles.introDots}>
                {tutorials.map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.introDot} ${
                      index === tutorialStep ? styles.introDotActive : ''
                    }`}
                  />
                ))}
              </div>
              
              <div className={styles.introButtons}>
                <button
                  onClick={handleSkip}
                  className={styles.introButtonSkip}
                >
                  건너뛰기
                </button>
                <button
                  onClick={handleNext}
                  className={styles.introButtonNext}
                >
                  {tutorialStep === tutorials.length - 1 ? '시작하기' : '다음'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Intro;