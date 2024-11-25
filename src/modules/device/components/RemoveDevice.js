// RemoveDevice.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeDevice } from '../states/deviceSlice.js';
import styles from './device.module.css';

const RemoveDevice = () => {
    const devices = useSelector(state => state.device);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedDevices, setSelectedDevices] = useState([]);

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
        alert("디바이스가 삭제되었습니다.");
        navigate(-1);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Matter Tunnel</h1>
            </div>

            <div className={styles.deviceHeader}>
                <h2 className={styles.deviceTitle}>Device 삭제</h2>
                <div className={styles.headerActions}>
                    <button 
                        className={styles.actionButton}
                        onClick={() => navigate(-1)}
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
            </div>

            <div className={styles.deviceGrid}>
                {devices.map((device) => (
                    <div key={device.publicKey} className={styles.deviceCard}>
                        <div className={styles.deviceIcon}></div>
                        <div className={styles.deviceInfo}>
                            <h3 className={styles.deviceName}>{device.deviceType}</h3>
                            <p className={styles.deviceId}>{device.publicKey.substring(0, 12)}...</p>
                        </div>
                        <label className={styles.checkboxWrapper}>
                            <input
                                type="checkbox"
                                checked={selectedDevices.includes(device.publicKey)}
                                onChange={() => handleCheckboxChange(device.publicKey)}
                                className={styles.checkbox}
                            />
                            <span className={styles.checkmark}></span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RemoveDevice;