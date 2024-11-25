import { createSlice } from '@reduxjs/toolkit'

const savedDevices = localStorage.getItem('devices');
const initialState = savedDevices ? JSON.parse(savedDevices) : []; 

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        addDevice: (state, action) => {
            state.push({
                deviceType: action.payload.deviceType,
                publicKey: action.payload.publicKey,
                functions: action.payload.functions
            });
            localStorage.setItem('devices', JSON.stringify(state));
        },
        removeDevice: (state, action) => {
            const updatedState = state.filter(device => device.publicKey !== action.payload);
            localStorage.setItem('devices', JSON.stringify(updatedState));
            return updatedState
        },       
    }
})

export const { addDevice, removeDevice, updateDevice } = deviceSlice.actions;
export default deviceSlice.reducer