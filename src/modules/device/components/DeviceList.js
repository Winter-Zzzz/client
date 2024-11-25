import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { removeDevice } from '../states/deviceSlice.js';
import styles from './device.module.css';

const DeviceList = () => {
    const devices = useSelector(state => state.device);
    const dispatch = useDispatch();
    const location = useLocation();
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedDevices, setSelectedDevices] = useState([]);
    
    const isAddDevicePage = location.pathname === '/addDevice';

    const handleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setSelectedDevices([]);
    };

    const handleCheckboxChange = (publicKey) => {
        setSelectedDevices(prev =>
            prev.includes(publicKey)
                ? prev.filter(key => key !== publicKey)
                : [...prev, publicKey]
        );
    };

    const handleDelete = () => {
        selectedDevices.forEach(publicKey => {
            dispatch(removeDevice(publicKey));
        });
        setSelectedDevices([]);
        setIsDeleteMode(false);
        alert('디바이스가 삭제되었습니다.');
    };

    // 상태 변화를 위한 useEffect 추가
    useEffect(() => {
        // 디바이스 상태가 바뀔 때마다 콘솔에 출력해 확인 (디버깅용)
        console.log("현재 디바이스 상태: ", devices);
    }, [devices]);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Matter Tunnel</h1>
            </div>

            <div className={styles.deviceHeader}>
                <h2 className={styles.deviceTitle}>
                    {isDeleteMode ? 'Device 삭제' : 'Device'}
                </h2>
                {isDeleteMode ? (
                    <div className={styles.headerActions}>
                        <button 
                            className={styles.actionButton}
                            onClick={handleDeleteMode}
                        >
                            취소
                        </button>
                        <button 
                            className={`${styles.actionButton} ${styles.deleteAction}`}
                            onClick={handleDelete}
                            disabled={selectedDevices.length === 0}
                        >
                            삭제
                        </button>
                    </div>
                ) : (
                    <div className={styles.headerActions}>
                        <Link to="/addDevice">
                            <button 
                                className={`${styles.iconButton} ${isAddDevicePage ? styles.active : ''}`}
                                disabled={isDeleteMode}
                            >
                                +
                            </button>
                        </Link>
                        <button 
                            className={`${styles.iconButton} ${isDeleteMode ? styles.active : ''}`}
                            onClick={handleDeleteMode}
                        >
                            -
                        </button>
                    </div>
                )}
            </div>

            {devices.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>디바이스를 추가하고 Matter Tunnel의 다양한 서비스를 경험해보세요.</p>
                </div>
            ) : (
                <div className={styles.deviceGrid}>
                    {devices.map((device) => (
                        <div 
                            key={device.publicKey} 
                            className={`${styles.deviceCard} ${isDeleteMode ? styles.deleteMode : ''}`}
                        >
                            <div className={styles.deviceIcon}></div>
                            <div className={styles.deviceInfo}>
                                {/* deviceType을 그대로 표시 (기본값 제거) */}
                                <h3 className={styles.deviceName}>{device.deviceType}</h3>
                                <p className={styles.deviceId}>
                                    {device.publicKey.substring(0, 12)}...
                                </p>
                            </div>
                            {!isDeleteMode && (
                                <Link to={`/updateDevice/${device.publicKey}`}>
                                    <button className={styles.menuButton}>
                                        ⋮
                                    </button>
                                </Link>
                            )}
                            {isDeleteMode && (
                                <label className={styles.checkboxWrapper}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDevices.includes(device.publicKey)}
                                        onChange={() => handleCheckboxChange(device.publicKey)}
                                        className={styles.checkbox}
                                    />
                                    <span className={styles.checkmark}></span>
                                </label>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeviceList;