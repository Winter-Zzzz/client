import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addDevice } from '../states/deviceSlice'
import { useNavigate, Link } from 'react-router-dom'

const AddDevicePage = () => { // 추후 수정예정
    const dispatch = useDispatch()
    const navigate = useNavigate(0)

    const [deviceType, setDeviceType] = useState('')
    const [publicKey, setPublicKey] = useState('')

    const onTypeChange = e => setDeviceType(e.target.value)
    const onPublicKeyChange = e => setPublicKey(e.target.value)

    const onAddDeviceClick = () => {
        if (deviceType && publicKey) {
            dispatch(addDevice({deviceType, publicKey}))
            setDeviceType('')
            setPublicKey('')
            alert('디바이스가 등록되었습니다 ')
            navigate('./device')
        }
    }

    return (
        <section>
            <h2> 추가할 기기 정보를 입력하세요  </h2>
            <form>
                {/* 이 부분 나중에는 없앨거임 ! */}
                <label htmlFor="deviceType">Device Type:</label>
                <input
                    type="text"
                    id="deviceType"
                    name="deviceType"
                    value={deviceType}
                    onChange={onTypeChange}
                />
                <br />
                <label htmlFor="publicKey">Public Key:</label>
                <input
                    type="text"
                    id="publicKey"
                    name="publicKey"
                    value={publicKey}
                    onChange={onPublicKeyChange}
                />
                <Link to="/device"><button type="button" onClick={onAddDeviceClick}>Add Device</button></Link>
            </form>
        </section>
    )
}

export default AddDevicePage;