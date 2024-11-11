import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRemove } from '../hooks/useDevice'

const DeviceList = ( ) => {
    const devices = useSelector(state=>state.device)
    const { onRemoveClick } = useRemove();
     console.log(devices)

    const renderedDevices = devices.map((device) => (
        <article key={device.deviceID}>
            <h4>{device.deviceName}</h4>
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

//     const { setNewDevice, handleAddDevice } = useAdd();
//     const { handleRemoveDevice } = useRemove();

//     const [inputType, setInputType] = useState('');
//     const [inputNickname, setInputNickname] = useState('');
    
//     const onTypeChange = (e) => setInputType(e.target.value);
//     const onNicknameChange = (e) => setInputNickname(e.target.value);

//     const onAddDeviceClick = () => {
//         if (inputType && inputNickname) {
//             setNewDevice({ type: inputType, nickname: inputNickname });
//             handleAddDevice()
//             setInputType('')
//             setInputNickname('')
//         }
//     }

//     const renderedDevice = device.map(device => {
//         console.log(device);
//         return (
//         <article key={device.id}>
//             <p>{device.id}</p>
//             <h3>{device.type}</h3>
//             <p
//                 onClick={() => handleRemoveDevice(device.id) }
//             >
//                 {device.nickname}</p>
//         </article>)
// })
//     return (
//         <section>
//             <h2>Devices</h2>
//             <input
//                 type="text"
//                 placeholder="Device Type"
//                 value={inputType}
//                 onChange={onTypeChange}
//             />
//             <input
//                 type="text"
//                 placeholder="Device Nickname"
//                 value={inputNickname}
//                 onChange={onNicknameChange}
//             />
//             <button onClick={onAddDeviceClick}>Add Device</button>
//             <div>{renderedDevice}</div>
//         </section>
//     )

export default DeviceList