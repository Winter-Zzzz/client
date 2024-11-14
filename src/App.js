import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './modules/auth/components/Login';
import SignUp from './modules/auth/components/SignUp';
import AddDevice from './modules/device/components/AddDevice'
import UpdateDevice from './modules/device/components/UpdateDevice'
import DeviceList from './modules/device/components/DeviceList'


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<><Login /><SignUp /></>} />
        <Route path="/device" element={<DeviceList />}/>
        <Route path="/addDevice" element={<AddDevice />} />
        <Route path="/updateDevice/:publicKey" element={<UpdateDevice />} />

      </Routes>
    </Router>
    </>
  );
}
export default App;
