import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './modules/auth/components/Login';
import SignUp from './modules/auth/components/SignUp';
import AddDevice from './modules/device/components/AddDevice'
import UpdateDevice from './modules/device/components/UpdateDevice'
import DeviceList from './modules/device/components/DeviceList'
import User from './modules/auth/components/user';
import BottomNav from './modules/device/components/BottomNav';

// BottomNav를 조건부로 표시할 레이아웃 컴포넌트
const Layout = ({ children }) => {
  const location = useLocation();
  const showNav = location.pathname !== '/';  // 루트 경로가 아닐 때만 Nav 표시

  return (
    <>
      {children}
      {showNav && <BottomNav />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<><Login /><SignUp /></>} />
          <Route path="/device" element={<DeviceList />}/>
          <Route path="/addDevice" element={<AddDevice />} />
          <Route path="/updateDevice/:publicKey" element={<UpdateDevice />} />
          <Route path="/account" element={<User />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;