import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './modules/auth/components/Login';
import SignUp from './modules/auth/components/SignUp';
import AddDevice from './modules/device/components/AddDevice';
import DeviceList from './modules/device/components/DeviceList'


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/device" element={<><AddDevice /><DeviceList /></>}/>
      </Routes>
    </Router>
    </>
  );
}
export default App;