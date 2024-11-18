import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { addDevice } from '../states/deviceSlice'
import { useNavigate, Link } from 'react-router-dom'
import QRScanner from './QRScanner.js'

const AddDevicePage = () => { // 추후 수정예정
    const dispatch = useDispatch()
    const navigate = useNavigate(0)

    const [deviceType, setDeviceType] = useState('')
    const [publicKey, setPublicKey] = useState('')

    const onTypeChange = useCallback((e) => setDeviceType(e.target.value), []);
    const onPublicKeyChange = useCallback((e) => setPublicKey(e.target.value), []);

    const onAddDeviceClick = useCallback(() => {
        if (publicKey) {
            dispatch(addDevice({deviceType, publicKey}))
            setDeviceType('')
            setPublicKey('')
            alert('디바이스가 등록되었습니다 ')
            navigate('./device')
        }
    }, [dispatch, deviceType, publicKey, navigate]);

    return (
        <section>
            <h2>디바이스 추가</h2>
            <button onClick={() => navigate(-1)}>X</button>
            <p>QR 코드를 스캔하거나, <br /> 디바이스 코드를 입력해 주세요.</p>
            <form>
            <div>
            <QRScanner />
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
                    placeholder="디바이스 코드를 입력해주세요."
                    onChange={onPublicKeyChange}
                />
            </div>
                <Link to="/device"><button type="button" onClick={onAddDeviceClick}>등록</button></Link>
            </form>
        </section>
    )
}

export default AddDevicePage;