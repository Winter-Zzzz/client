import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const authStore = configureStore({
    reducer: {
        auth: authReducer,
    },
});


export default authStore;