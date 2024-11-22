import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './device.module.css';

const UpdateDevice = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const device = useSelector(state => 
        state.device.find(d => d.publicKey === id)
    );
    const [feedback, setFeedback] = useState('');
    const [inputValues, setInputValues] = useState({
        power: '',
        color: '',
        brightness: '',
    });

    // 디바이스 함수들 정의
    const deviceFunctions = [
        { name: 'Power', type: 'boolean', func: 'setLED' },
        { name: 'Color', type: 'string', func: 'setColor' },
        { name: 'Brightness', type: 'number', func: 'setBrightness' },
    ];

    const handleInputChange = (functionName, value) => {
        setInputValues(prev => ({
            ...prev,
            [functionName.toLowerCase()]: value
        }));
    };

    const handleExecute = (funcName, type, value) => {
        const formattedValue = value.trim();
        
        if (!formattedValue) {
            setFeedback('값을 입력해주세요.');
            return;
        }

        let isValidInput = true;
        let processedValue = formattedValue;

        // 입력값 유효성 검사
        switch (type) {
            case 'boolean':
                isValidInput = ['true', 'false'].includes(formattedValue.toLowerCase());
                processedValue = formattedValue.toLowerCase() === 'true';
                break;
            case 'number':
                isValidInput = !isNaN(formattedValue) && formattedValue !== '';
                processedValue = Number(formattedValue);
                break;
            case 'string':
                isValidInput = formattedValue !== '';
                break;
            default:
                isValidInput = false;
        }

        if (!isValidInput) {
            setFeedback(`올바른 ${type} 값을 입력해주세요.`);
            return;
        }

        // 피드백 메시지 설정
        let feedbackMessage = `${device?.deviceType || '전구'} `;
        
        switch (funcName) {
            case 'setLED':
                feedbackMessage += `${processedValue ? '켜짐' : '꺼짐'}`;
                break;
            case 'setColor':
                feedbackMessage += `색상 ${processedValue}으로 변경했습니다!`;
                break;
            case 'setBrightness':
                feedbackMessage += `밝기 (${processedValue})으로 변경했습니다!`;
                break;
            default:
                feedbackMessage += `설정이 변경되었습니다.`;
        }

        setFeedback(feedbackMessage);

        // 입력값 초기화
        setInputValues(prev => ({
            ...prev,
            [funcName.toLowerCase().replace('set', '').toLowerCase()]: ''
        }));
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <button 
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    ← {device?.deviceType || '전구'}
                </button>
            </div>

            <div className={styles.deviceDetail}>
                <div className={styles.deviceIcon}>
                    {/* 전구 아이콘 이미지 */}
                </div>
                <h2 className={styles.deviceTitle}>{device?.deviceType || '전구'}</h2>
                {feedback && (
                    <div className={styles.feedback}>
                        {feedback}
                    </div>
                )}
            </div>

            <div className={styles.functionList}>
                {deviceFunctions.map((func, index) => (
                    <div key={index} className={styles.functionItem}>
                        <label className={styles.functionLabel}>
                            {func.name}
                        </label>
                        <div className={styles.functionInputs}>
                            <input
                                type="text"
                                placeholder={func.type}
                                value={inputValues[func.name.toLowerCase()]}
                                onChange={(e) => handleInputChange(func.name, e.target.value)}
                                className={styles.functionInput}
                            />
                            <button 
                                className={styles.executeButton}
                                onClick={() => handleExecute(
                                    func.func, 
                                    func.type, 
                                    inputValues[func.name.toLowerCase()]
                                )}
                            >
                                실행
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpdateDevice;