// AddDevice.js
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addDevice } from '../states/deviceSlice.js';
import QrReader from "react-qr-scanner";
import MatterTunnel from "../../../common/matter_tunnel";
import styles from './device.module.css';

const AddDevice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const qrRef = useRef(null);

    const [qrScanError, setQrScanError] = useState("");
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [manualPublicKey, setManualPublicKey] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [isScanning, setIsScanning] = useState(true);

    const handleScan = async (data) => {
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
    };

    const handleError = (err) => {
        console.error("QR 스캔 에러:", err);
        setQrScanError(err.message);
    };

    const handleSubmit = () => {
        if ((deviceInfo || manualPublicKey) && deviceName) {
            dispatch(addDevice({
                deviceType: deviceName,
                publicKey: deviceInfo ? deviceInfo.publicKey : manualPublicKey,
            }));
            alert("디바이스가 등록되었습니다.");
            navigate(-1);
        }
    };

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
                QR 코드를 스캔하거나,<br/>
                디바이스 코드를 입력해 주세요.
            </p>

            <div className={styles.qrContainer}>
                {isScanning ? (
                    <QrReader
                        ref={qrRef}
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        className={styles.qrScanner}
                    />
                ) : (
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

            <div className={styles.inputSection}>
                <h3 className={styles.inputTitle}>디바이스 코드 입력</h3>
                <input
                    type="text"
                    className={styles.input}
                    value={manualPublicKey}
                    onChange={(e) => setManualPublicKey(e.target.value)}
                    placeholder="디바이스 코드를 입력해주세요."
                />
            </div>

            {(deviceInfo || manualPublicKey) && (
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
                disabled={!((deviceInfo || manualPublicKey) && deviceName)}
            >
                등록
            </button>
        </div>
    );
};

export default AddDevice;