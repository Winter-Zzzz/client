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
            {/*publicKey 받아오면 자동으로 type 뜨게 바꾸기 !*/}
            <p>{device.publicKey}</p>
            {/* 변경 대신 기기 관리 창으로 넘어가게 바꿀예정 */}
            <button>기기관리창으로 넘어가게 할 예정 !</button>
            {/* <Link to={`/updateDevice/${device.publicKey}`}><button>...</button></Link> */}
        </article>
    ))

    return (
        <>
            <Link to="/addDevice"><button>기기 추가하기</button></Link>
            <button
                onClick={toggleRemoveMode}>{removeMode ? '삭제 취소' : '기기 삭제하기'}</button>
            {devices.length === 0 ? (
                <p>디바이스를 추가하고 Matter Tunnel의 다양한 서비스를 경험해보세요.</p>
            ) : removeMode ? (
                <RemoveDevice devices={devices} onCancel={() => setRemoveMode(false)} />
            ) : (
                <div>{renderedDevices}</div>
            )}
        </>
    )
}

export default DeviceList