import React from 'react'
import { useAdd } from '../hooks/useDevice'

const AddDevice = () => { // 추후 수정예정
    const { newDevice, onTypeChange, onNameChange, onAddClick } = useAdd();

    return (
        <section>
            <h2> ADD </h2>
            <form>
                <label htmlFor="deviceType">Device Type:</label>
                <input
                    type="text"
                    id="deviceType"
                    name="deviceType"
                    value={newDevice.deviceType}
                    onChange={onTypeChange}
                />
                <br />
                <label htmlFor="deviceName">Device Nickname:</label>
                <input
                    type="text"
                    id="deviceName"
                    name="deviceName"
                    value={newDevice.deviceName}
                    onChange={onNameChange}
                />
                <button type="button" onClick={onAddClick}>Add Device</button>
            </form>
        </section>
    )
}

export default AddDevice;