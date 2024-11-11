import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './modules/auth/components/Login';
import SignUp from './modules/auth/components/SignUp';
import Device from './modules/device/components/DeviceList';


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<><Login /><SignUp /></>} />
        <Route path="/device" element={<Device />} />
      </Routes>
    </Router>
    </>
  );
}
export default App;
