import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addDevice } from '../states/deviceSlice'
import { useNavigate, Link } from 'react-router-dom'
import QrReader from 'react-qr-scanner';

const AddDevicePage = () => { // 추후 수정예정
    const dispatch = useDispatch()
    const navigate = useNavigate(0)

    const [deviceType, setDeviceType] = useState('')
    const [publicKey, setPublicKey] = useState('')
    const [qrScanError, setQrScanError] = useState('')

    const onTypeChange = e => setDeviceType(e.target.value)
    const onPublicKeyChange = e => setPublicKey(e.target.value)

    const onAddDeviceClick = () => {
        if (publicKey) {
            dispatch(addDevice({deviceType, publicKey}))
            setDeviceType('')
            setPublicKey('')
            alert('디바이스가 등록되었습니다 ')
            navigate('./device')
        }
    }

    // QR 코드 스캔 후, publicKey에 맞는 deviceType을 자동으로 설정
    const handleScan = (data) => {
        if (data) {
            setPublicKey(data);  // QR 코드에서 받은 publicKey를 설정
            fetchDeviceTypeByPublicKey(data); // publicKey로 deviceType 자동 설정
        }
    };

    // QR 코드에서 받은 publicKey로 deviceType을 가져오는 함수
    const fetchDeviceTypeByPublicKey = async (publicKey) => {
        try {
            const response = await fetch(`/api/device/${publicKey}`);
            const deviceData = await response.json();
            setDeviceType(deviceData.deviceType);  // API에서 가져온 deviceType을 설정
        } catch (error) {
            console.error('Error fetching device type:', error);
        }
    };

    const handleError = (err) => {
        setQrScanError(err.message);
    }

    return (
        <section>
            <h2>디바이스 추가</h2>
            <button onClick={() => navigate(-1)}>X</button>
            <p>QR 코드를 스캔하거나, <br /> 디바이스 코드를 입력해 주세요.</p>
            <form>
            <div>
            <h4>QR 코드 스캔</h4>
            <QrReader
                    delay={300}
                    style={{ width: '100%' }}
                    onError={handleError}
                    onScan={handleScan}
                />
                {qrScanError && <p>QR 코드 스캔 에러: {qrScanError}</p>}
                {/* 이 부분 나중에는 수정예정 ! */}
                <br />
                <input
                    type="text"
                    id="deviceType"
                    name="deviceType"
                    value={deviceType}
                    onChange={onTypeChange}
                    disabled
                />
            </div>
            <div>
                <h4>디바이스 코드 입력</h4>
                <input
                    type="text"
                    id="publicKey"
                    name="publicKey"
                    value={publicKey}
                    placeHolder="디바이스 코드를 입력해주세요."
                    onChange={onPublicKeyChange}
                />
            </div>
                <Link to="/device"><button type="button" onClick={onAddDeviceClick}>등록</button></Link>
            </form>
        </section>
    )
}

export default AddDevicePage;