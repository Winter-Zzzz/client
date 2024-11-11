import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loginState: localStorage.getItem('loginState') === 'true',
        privateKey: localStorage.getItem('privateKey') || '',
        message: '',
};


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setPrivateKey: (state, action) => {
            state.privateKey = action.payload;
            localStorage.setItem('privateKey', state.privateKey);
        },
        loginSuccess: (state, action) => {
            state.loginState = true;
            state.privateKey = action.payload.privateKey;
            state.message = 'Login Completed'
            localStorage.setItem('loginState', 'true');
            localStorage.setItem('privateKey', state.privateKey);
        },
        loginFail: (state) => {
            state.loginState = false;
            state.message = 'Login Failed'
        },
        invalidFormat: (state) => {
            state.loginState = false;
            state.message = 'Your key is incorrectly formatted'
        },
        logout: (state) => {
            state.loginState = false;
            state.message = 'Logout Completed';
            localStorage.removeItem('loginState')
        }
    }
});

export const { setPrivateKey, loginSuccess, loginFail, invalidFormat, logout } = authSlice.actions;

export default authSlice.reducer;