import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import authStore from './modules/auth/states/store';
import deviceStore from './modules/device/states/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    {/* <React.StrictMode> */}
    <Provider store={store}>
    <App />
    </Provider>
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
