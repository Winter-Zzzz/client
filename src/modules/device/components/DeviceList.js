import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useRemoveDevice from '../hooks/useRemoveDevice'
import RemoveDevice from './RemoveDevice';

const DeviceList = ( ) => {
    const devices = useSelector(state=>state.device)
    const [removeMode, setRemoveMode] = useState(false);
    console.log(devices)

    const toggleRemoveMode = () => {
        setRemoveMode((prev) => !prev);
    }

    const renderedDevices = devices.map((device) => (
        <article key={device.publicKey}>
            <h4>{device.publicKey}</h4>
            <p>{device.deviceType}</p>
            <Link to={`/updateDevice/${device.publicKey}`}><button>Update</button></Link>
        </article>
    ))

    return (
        <>
            <Link to="/addDevice"><button>기기 추가하기</button></Link>
            <button
                onClick={toggleRemoveMode}>{removeMode ? '삭제 취소' : '기기 삭제하기'}</button>
            {removeMode ? (
                <RemoveDevice 
                    devices={devices}
                    onCancel={() => setRemoveMode(false)} />
            ) : (
                <div>{renderedDevices}</div>
            )}
        </>
    )
}

export default DeviceList