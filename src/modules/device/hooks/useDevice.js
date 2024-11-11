import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addDevice, removeDevice } from '../states/deviceSlice'

export const useAdd = () => {
    const [newDevice, setNewDevice] = useState({
        deviceID: '',
        deviceType: '',
        deviceKey: '',
    })
    const dispatch = useDispatch();
    const devices = useSelector(state => state.device)

    const onTypeChange = e => setNewDevice(prev => ({...prev, deviceType: e.target.value }))
    const onKeyChange = e => setNewDevice(prev => ({...prev, deviceKey: e.target.value }))


    const onAddClick = () => {
        if (newDevice.deviceType && newDevice.deviceKey) {
            const newDeviceWithID = {
                                ...newDevice,
                                deviceID: devices.length + 1
                            }
            dispatch(addDevice(newDeviceWithID))
            setNewDevice({deviceID: '', deviceType: '', deviceKey: ''})
        }
    }


    return {
        newDevice,
        onTypeChange,
        onKeyChange,
        onAddClick,
    }}

export const useRemove = () => {

        const dispatch = useDispatch();

        const onRemoveClick = (deviceID) => {
            dispatch(removeDevice(deviceID));
        };
        return { onRemoveClick };
}