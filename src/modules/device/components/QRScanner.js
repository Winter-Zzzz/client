import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addDevice } from '../states/deviceSlice';
import QrReader from 'react-qr-scanner';

const QRScanner = () => {
    const dispatch = useDispatch()
    const [qrScanError, setQrScanError] = useState('')
    const [deviceType, setDeviceType] = useState('')
    const [publicKey, setPublicKey] = useState('')

    const handleScan = async (data) => {
        if (data) {
            setPublicKey(data);
            await fetchDeviceTypeByPublicKey(data);
        }
    }

    const fetchDeviceTypeByPublicKey = async (publicKey) => {
        try {
            const response = await fetch(`/api/device/${publicKey}`);
            const deviceData = await response.json();
            setDeviceType(deviceData.deviceType);

            // Redux 
            dispatch(addDevice({ deviceType: deviceData.deviceType, publicKey }))
            setPublicKey('')
            setDeviceType('')
            alert('디바이스가 등록되었습니다.')
            console.log('Device Added')
        } catch (error) {
            console.error('Error fetching device type:', error)
            setQrScanError('QR 코드 스캔에 실패했습니다.')
        }
    };

    const handleError = (err) => {
        setQrScanError(err.message);
    }

    const memoizedQrReader = useMemo(() => (
        <QrReader
            delay={300}
            style={{ width: '100%' }}
            onError={handleError}
            onScan={handleScan}
        />
    ), []);

    return (
        <div>
            <h4>QR 코드 스캔</h4>
            {memoizedQrReader}
            {qrScanError && <p>QR 코드 스캔 에러: {qrScanError}</p>}
        </div>
    );
}

export default QRScanner;