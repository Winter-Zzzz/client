import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRemove } from '../hooks/useDevice'

const DeviceList = ( ) => {
    const devices = useSelector(state=>state.device)
    const { onRemoveClick } = useRemove();
     console.log(devices)

    const renderedDevices = devices.map((device) => (
        <article key={device.deviceID}>
            <h4>{device.deviceKey}</h4>
            {/* <p>{device.deviceID}</p> */}
            <p>{device.deviceType}</p>
            <button onClick={() => onRemoveClick(device.deviceID)}>Delete</button>
        </article>
    ))

    return (
        <>
        {console.log('rendered')}
            <div>{renderedDevices}</div>
            </>
            )}

export default DeviceList