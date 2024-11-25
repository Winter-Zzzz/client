import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../auth/states/authSlice'
import deviceReducer from '../../device/states/deviceSlice'


const store = configureStore({
    reducer: {
        auth: authReducer,
        device: deviceReducer
    }
})

export default store