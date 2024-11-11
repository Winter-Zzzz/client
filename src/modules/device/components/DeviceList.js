import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addDevice } from '../states/deviceSlice'

const DeviceList = () => {
    const device = useSelector(state => state.device || [])
    const dispatch = useDispatch();
    const [inputType, setInputType] = useState('');
    const [inputNickname, setInputNickname] = useState('');
    
    const onTypeChange = (e) => setInputType(e.target.value);
    const onNicknameChange = (e) => setInputNickname(e.target.value);

    const onAddDeviceClick = () => {
        if (inputType && inputNickname) {
            dispatch(addDevice({ type: inputType, nickname: inputNickname}))
            console.log({ type: inputType, nickname: inputNickname });
            setInputType('')
            setInputNickname('')
        }
    }

    const renderedDevice = device.map(device => (
        <article key={device.id}>
            <h3>{device.type}</h3>
            <p>{device.nickname}</p>
        </article>
    ))
    return (
        <section>
            <h2>Devices</h2>
            <input
                type="text"
                placeholder="Device Type"
                value={inputType}
                onChange={onTypeChange}
            />
            <input
                type="text"
                placeholder="Device Nickname"
                value={inputNickname}
                onChange={onNicknameChange}
            />
            <button onClick={onAddDeviceClick}>Add Device</button>
            <div>{renderedDevice}</div>
        </section>
    )
}

export default DeviceList