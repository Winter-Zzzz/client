import React from 'react'
import { useSelector } from 'react-redux'

const DeviceList = () => {

    const device = useSelector(state => state.device || [])
    console.log(device)
    const renderedDevice = device.map(device => (
        <article key={device.id}>
            <h3>{device.type}</h3>
            <p>{device.nickname}</p>
        </article>
    ))
    
    return (
        <section>
            <h2>Devices</h2>
            {renderedDevice}
        </section>
    )
}

export default DeviceList