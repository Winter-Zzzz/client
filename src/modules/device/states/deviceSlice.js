import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    { deviceType: 'refrigerator', publicKey: 'publicKey1' },
    { deviceType: 'tv', publicKey: 'publicKey2' },
    { deviceType: 'speaker', publicKey: 'publicKey3' },
]

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        addDevice: (state, action) => {
            state.push(action.payload)
        },
        removeDevice: (state, action) => {
            return state.filter(device => device.publicKey !== action.payload);
        },
        updateDevice: (state, action) => {
            const { publicKey, updatedData } = action.payload;
            const deviceIndex = state.findIndex(device => device.publicKey === publicKey);
            
            if (deviceIndex !== -1) {
                console.log('Updating device:', state[deviceIndex]);
                if (updatedData.publicKey) {
                    state[deviceIndex].publicKey = updatedData.publicKey;
                }
                state[deviceIndex] = { ...state[deviceIndex], ...updatedData };
                console.log('Updated device:', state[deviceIndex]);
            } else {
                console.log('Device not found:', publicKey);
            }
        }
        
        
        
    }
})

export const { addDevice, removeDevice, updateDevice } = deviceSlice.actions;
export default deviceSlice.reducer