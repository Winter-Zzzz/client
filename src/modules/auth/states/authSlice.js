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
        loginSuccess: (state, action) => {
            const privateKey = action.payload;
            state.loginState = true;
            state.privateKey = privateKey;
            state.message = 'Login Completed'
            console.log('privateKey');
        },
        invalidFormat: (state) => {
            state.loginState = false;
            state.message = 'Your key is incorrectly formatted'
        },
        logout: (state) => {
            state.loginState = false;
            state.message = 'Logout Completed';
            // 나중에 useLogout으로 옮기기
            // 여기다거 두면 오류 나는듯?
            // localStorage.removeItem('loginState');
            // localStorage.removeItem('privateKey');
        }
    }
});

export const { loginSuccess, invalidFormat, logout } = authSlice.actions;

export default authSlice.reducer;