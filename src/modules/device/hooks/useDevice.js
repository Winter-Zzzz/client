import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addDevice, removeDevice } from '../states/deviceSlice'

export const useAdd = () => {
    const [newDevice, setNewDevice] = useState({
        deviceID: '',
        deviceType: '',
        deviceName: '',
    })
    const dispatch = useDispatch();
    const devices = useSelector(state => state.device)

    const onTypeChange = e => setNewDevice(prev => ({...prev, deviceType: e.target.value }))
    const onNameChange = e => setNewDevice(prev => ({...prev, deviceName: e.target.value }))


    const onAddClick = () => {
        if (newDevice.deviceType && newDevice.deviceName) {
            const newDeviceWithID = {
                                ...newDevice,
                                deviceID: devices.length + 1
                            }
            dispatch(addDevice(newDeviceWithID))
            setNewDevice({deviceID: '', deviceType: '', deviceName: ''})
        }
    }


    return {
        newDevice,
        onTypeChange,
        onNameChange,
        onAddClick,
    }}

export const useRemove = () => {

        const dispatch = useDispatch();

        const onRemoveClick = (deviceID) => {
            dispatch(removeDevice(deviceID));
        };
        return { onRemoveClick };
}