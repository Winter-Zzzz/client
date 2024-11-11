import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    { deviceID: '1', deviceType: 'refrigerator', deviceName: 'deviceName1' },
    { deviceID: '2', deviceType: 'tv', deviceName: 'deviceName2' },
    { deviceID: '3', deviceType: 'speaker', deviceName: 'deviceName3' },
]

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        addDevice: (state, action) => {
            state.push(action.payload)
        },
        removeDevice: (state, action) => {
            return state.filter(device => device.deviceID !== action.payload);
        }
    }
})

export const { addDevice, removeDevice } = deviceSlice.actions;
export default deviceSlice.reducer