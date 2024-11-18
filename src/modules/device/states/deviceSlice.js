import { createSlice } from '@reduxjs/toolkit'

const savedDevices = localStorage.getItem('devices');
const initialState = savedDevices ? JSON.parse(savedDevices) : [
    { deviceType: 'refrigerator', publicKey: 'publicKey1' },
    { deviceType: 'tv', publicKey: 'publicKey2' },
    { deviceType: 'speaker', publicKey: 'publicKey3' },
];

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        addDevice: (state, action) => {
            state.push(action.payload)
            localStorage.setItem('devices', JSON.stringify(state));
        },
        removeDevice: (state, action) => {
            const updatedState = state.filter(device => device.publicKey !== action.payload);
            localStorage.setItem('devices', JSON.stringify(updatedState));
            return updatedState
        },
        // 현재 update 사용 X
        // updateDevice: (state, action) => {
        //     const { publicKey, updatedData } = action.payload;
        //     const deviceIndex = state.findIndex(device => device.publicKey === publicKey);
            
        //     if (deviceIndex !== -1) {
        //         console.log('Updating device:', state[deviceIndex]);
        //         if (updatedData.publicKey) {
        //             state[deviceIndex].publicKey = updatedData.publicKey;
        //         }
        //         state[deviceIndex] = { ...state[deviceIndex], ...updatedData };
        //         console.log('Updated device:', state[deviceIndex]);
        //         localStorage.setItem('devices', JSON.stringify(state));
        //     } else {
        //         console.log('Device not found:', publicKey);
        //     }
        //}
        
        
        
    }
})

export const { addDevice, removeDevice, updateDevice } = deviceSlice.actions;
export default deviceSlice.reducer