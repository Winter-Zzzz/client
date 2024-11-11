import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { addDevice } from '../states/deviceSlice'

const useAddDevice = () => {
    const dispatch = useDispatch()
    const [newDevice, setNewDevice] = useState({
        // 임의로 설정해둠 ! 나중에 바꿀 예정
        type: '',
        nickname: ''
    });

    const handleAddDevice = () => {
        if (newDevice.type && newDevice.nickname) {
            const newDeviceWithId = {
                ...newDevice,
                id: uuidv4()
            }
            dispatch(addDevice(newDeviceWithId));
            setNewDevice({type: '', nickname: ''})
        }
    }

    return {
        newDevice,
        handleAddDevice,
        setNewDevice,
    };
}

export default useAddDevice