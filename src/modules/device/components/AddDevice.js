import React from 'react'
import { useAdd } from '../hooks/useDevice'

const AddDevice = () => { // 추후 수정예정
    const { newDevice, onTypeChange, onKeyChange, onAddClick } = useAdd();

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
                <label htmlFor="deviceKey">Device Key:</label>
                <input
                    type="text"
                    id="deviceKey"
                    name="deviceKey"
                    value={newDevice.deviceKey}
                    onChange={onKeyChange}
                />
                <button type="button" onClick={onAddClick}>Add Device</button>
            </form>
        </section>
    )
}

export default AddDevice;