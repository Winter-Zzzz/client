import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './device.module.css';

const UpdateDevice = () => {
    const navigate = useNavigate();
    const { publicKey } = useParams();
    const device = useSelector(state => 
        state.device.find(d => d.publicKey === publicKey)
    );

    const [feedback, setFeedback] = useState('');
    const [inputValues, setInputValues] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    
    const parseFunctions = (funcString) => {
        const match = funcString.match(/([^(]+)\(([^)]*)\)->(.*)/);
        if (!match) return null;
        
        return {
            name: match[1],
            parameters: match[2] ? match[2].split(',') : [],
            returnType: match[3]
        };
    };

    const deviceFunctions = (device?.functions || []).map(func => {
        const parsed = parseFunctions(func);
        return parsed ? {
            name: parsed.name,
            parameters: parsed.parameters,
            type: parsed.returnType
        } : null;
    }).filter(Boolean);

    const handleInputChange = (key, value) => {
        setInputValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const simulateDeviceFeedback = (funcName, processedValues) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                switch(funcName.toLowerCase()) {
                    case 'gettemp':
                        resolve(`${device?.deviceType || '디바이스'}의 현재 온도는 ${Math.floor(Math.random() * 30 + 10)}°C 입니다.`);
                        break;
                    case 'changecolor':
                        resolve(`${device?.deviceType || '디바이스'}의 색상을 ${processedValues[0]}로 변경했습니다.`);
                        break;
                    case 'setbrightness':
                        resolve(`${device?.deviceType || '디바이스'}의 밝기를 ${processedValues[0]}%로 설정했습니다.`);
                        break;
                    case 'setled':
                        const status = processedValues[1] ? '켜짐' : '꺼짐';
                        resolve(`${device?.deviceType || '디바이스'}의 LED ${processedValues[0]}번을 ${status}으로 설정했습니다.`);
                        break;
                    case 'getstatus':
                        resolve(`${device?.deviceType || '디바이스'}의 상태: 정상`);
                        break;
                    default:
                        resolve(`${device?.deviceType || '디바이스'}의 ${funcName} 함수가 실행되었습니다.`);
                }
            }, 2000);
        });
    };

    const handleExecute = async (funcName, paramTypes, paramValues) => {
        // 입력값 존재 여부 먼저 확인
        const values = paramValues.map(value => value || '');
        
        // 모든 필수 매개변수에 값이 입력되었는지 확인
        if (paramTypes.length > 0 && values.some(value => !value)) {
            setFeedback('모든 매개변수 값을 입력해주세요.');
            return;
        }

        // 입력값 유효성 검사
        let isValidInput = true;
        let processedValues = values.map((value, index) => {
            const type = paramTypes[index];
            const formattedValue = value.toString().trim();

            switch (type) {
                case 'boolean':
                    if (!['true', 'false'].includes(formattedValue.toLowerCase())) {
                        isValidInput = false;
                        return null;
                    }
                    return formattedValue.toLowerCase() === 'true';
                case 'number':
                    if (isNaN(formattedValue)) {
                        isValidInput = false;
                        return null;
                    }
                    return Number(formattedValue);
                case 'string':
                    return formattedValue;
                default:
                    isValidInput = false;
                    return null;
            }
        });

        if (!isValidInput) {
            setFeedback('올바른 형식의 값을 입력해주세요.');
            return;
        }

        alert('트랜잭션이 전송되었습니다!');
        
        // 해당 함수의 로딩 상태만 변경
        setLoadingStates(prev => ({
            ...prev,
            [funcName]: true
        }));
        
        setFeedback('트랜잭션을 처리중입니다...');

        try {
            const deviceResponse = await simulateDeviceFeedback(funcName, processedValues);
            setFeedback(deviceResponse);
            
            // 입력값 초기화
            if (paramTypes.length > 0) {
                values.forEach((_, index) => {
                    handleInputChange(`${funcName}_${index}`, '');
                });
            }
        } catch (error) {
            setFeedback('함수 실행 중 오류가 발생했습니다.');
        } finally {
            // 해당 함수의 로딩 상태만 false로 변경
            setLoadingStates(prev => ({
                ...prev,
                [funcName]: false
            }));
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <button 
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    ← 전구
                </button>
            </div>

            <div className={styles.deviceDetail}>
                <div className={styles.deviceInfoContainer}>
                    <div className={styles.deviceIcon}>
                        {/* 디바이스 아이콘 이미지 */}
                    </div>
                    <h2 className={styles.deviceTitle}>{device?.deviceType || '전구'}</h2>
                </div>
                {feedback && (
                    <div className={styles.feedback}>
                        <span className={styles.feedbackLabel}>피드백</span>
                        <span className={styles.feedbackContent}>
                            {feedback}
                        </span>
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
                            {func.parameters.map((paramType, pIndex) => (
                                <input
                                    key={pIndex}
                                    type="text"
                                    placeholder={paramType}
                                    value={inputValues[`${func.name}_${pIndex}`] || ''}
                                    onChange={(e) => handleInputChange(`${func.name}_${pIndex}`, e.target.value)}
                                    className={styles.functionInput}
                                    disabled={loadingStates[func.name]}
                                />
                            ))}
                            <button 
                                className={`${styles.executeButton} ${loadingStates[func.name] ? styles.loading : ''}`}
                                onClick={() => handleExecute(
                                    func.name,
                                    func.parameters,
                                    func.parameters.map((_, pIndex) => 
                                        inputValues[`${func.name}_${pIndex}`]
                                    )
                                )}
                                disabled={loadingStates[func.name]}
                            >
                                {loadingStates[func.name] ? '실행중...' : '실행'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpdateDevice;