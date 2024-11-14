import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateDevice } from '../states/deviceSlice'
import { useParams, Link } from 'react-router-dom'

const UpdateDevicePage = () => { 
    const { publicKey } = useParams()
    const device = useSelector(state => state.device.find(device => device.publicKey === publicKey))
    console.log(device)
    const [deviceType, setDeviceType] = useState(device.deviceType || '')
    const [key, setKey] = useState(device.publicKey || '')
    console.log(key)

    const dispatch = useDispatch()

    const onTypeChange = e => setDeviceType(e.target.value)
    const onKeyChange = e => setKey(e.target.value)

    const onUpdateDeviceClick = () => {
        if (deviceType && key) {
            // 새로운 publicKey와 deviceType을 전달
            dispatch(updateDevice({ publicKey: publicKey, updatedData: { publicKey: key, deviceType } }));
        }
    }

    return (
        <section>
            <h2> 변경할 기기 정보를 입력하세요  </h2>
            <form>
                <label htmlFor="deviceType">Device Type:</label>
                <input
                    type="text"
                    id="deviceType"
                    name="deviceType"
                    value={deviceType}
                    onChange={onTypeChange}
                />
                <br />
                <label htmlFor="key">Public Key:</label>
                <input
                    type="text"
                    id="key"
                    name="key"
                    value={key}
                    onChange={onKeyChange}
                />
                <Link to="/device"><button type="button" onClick={onUpdateDeviceClick}>Add Device</button></Link>
            </form>
        </section>
    )
}

export default UpdateDevicePage