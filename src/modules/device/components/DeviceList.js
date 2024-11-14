import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useRemoveDevice from '../hooks/useRemoveDevice'

const DeviceList = ( ) => {
    const devices = useSelector(state=>state.device)
    console.log(devices)

    const { removeDeviceHandler } = useRemoveDevice();

    const renderedDevices = devices.map((device) => (
        <article key={device.publicKey}>
            <h4>{device.publicKey}</h4>
            <p>{device.deviceType}</p>
            <Link to={`/updateDevice/${device.publicKey}`}><button>Update</button></Link>
            <button onClick={() => removeDeviceHandler(device.publicKey)}>삭제</button>
        </article>
    ))

    return (
        <>
            <Link to="/addDevice"><button>기기 추가하기</button></Link>
            <div>{renderedDevices}</div>
        </>
    )
}

export default DeviceList