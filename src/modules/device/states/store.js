import { configureStore } from '@reduxjs/toolkit'
import deviceReducer from './deviceSlice'

const deviceStore = configureStore({
    reducer: {
        device: deviceReducer
    }
})

export default deviceStore