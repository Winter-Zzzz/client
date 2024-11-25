import React, { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addDevice } from '../states/deviceSlice.js';
import QrReader from "react-qr-scanner";
import MatterTunnel from "../../../common/matter_tunnel";
import styles from './device.module.css';

const AddDevice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const qrRef = useRef(null);

    const [qrScanError, setQrScanError] = useState("");
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [deviceName, setDeviceName] = useState("");
    const [isScanning, setIsScanning] = useState(true);

    // QR 코드 스캔 핸들러 (메모이제이션됨)
    const handleScan = useCallback(async (data) => {
        if (data && isScanning) {
            try {
                const uint8Data = new Uint8Array(data.text.length);
                for (let i = 0; i < data.text.length; i++) {
                    uint8Data[i] = data.text.charCodeAt(i);
                }
                const info = JSON.parse(MatterTunnel.extractDeviceInfo(uint8Data));
                console.log("스캔된 디바이스 정보:", info);
                
                setDeviceInfo(info);
                setIsScanning(false);
            } catch (error) {
                console.error("QR 스캔 에러:", error);
                setQrScanError("QR 코드 처리 중 오류가 발생했습니다.");
            }
        }
    }, [isScanning]);

    // QR 코드 에러 핸들러 (메모이제이션됨)
    const handleError = useCallback((err) => {
        console.error("QR 스캔 에러:", err);
        setQrScanError(err.message);
    }, []);

    // 폼 제출 핸들러 (메모이제이션됨)
    const handleSubmit = useCallback(() => {
        if (deviceInfo && deviceName) {
            dispatch(addDevice({
                deviceType: deviceName,
                publicKey: deviceInfo.publicKey,
                functions: deviceInfo.functions
            }));
            alert("디바이스가 등록되었습니다.");
            navigate(-1);
        }
    }, [deviceInfo, deviceName, dispatch, navigate]);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Matter Tunnel</h1>
            </div>

            <div className={styles.deviceHeader}>
                <h2 className={styles.deviceTitle}>디바이스 추가</h2>
                <button 
                    className={styles.closeButton}
                    onClick={() => navigate(-1)}
                >
                    ✕
                </button>
            </div>

            <p className={styles.description}>
                QR 코드를 스캔해주세요.
            </p>

            <div className={styles.qrContainer}>
                <QrReader
                    ref={qrRef}
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    className={`${styles.qrScanner} ${!isScanning ? styles.hidden : ''}`}
                />
                {!isScanning && (
                    <div className={styles.qrSuccess}>
                        <p>QR 코드 스캔 완료!</p>
                        <button 
                            className={styles.rescanButton}
                            onClick={() => setIsScanning(true)}
                        >
                            다시 스캔
                        </button>
                    </div>
                )}
                {qrScanError && <p className={styles.errorText}>{qrScanError}</p>}
            </div>

            {deviceInfo && (
                <div className={styles.nameInputSection}>
                    <input
                        type="text"
                        className={styles.input}
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        placeholder="디바이스 이름을 입력하세요"
                    />
                </div>
            )}

            <button 
                className={styles.button}
                onClick={handleSubmit}
                disabled={!(deviceInfo && deviceName)}
            >
                등록
            </button>
        </div>
    );
};

export default AddDevice;