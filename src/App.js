import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Intro from './modules/auth/components/Intro';
import Login from './modules/auth/components/Login';
import SignUp from './modules/auth/components/SignUp';
import AddDevice from './modules/device/components/AddDevice';
import UpdateDevice from './modules/device/components/UpdateDevice';
import DeviceList from './modules/device/components/DeviceList';
import User from './modules/auth/components/user';
import BottomNav from './modules/device/components/BottomNav';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';

const Layout = ({ children }) => {
  const location = useLocation();
  // intro 화면과 auth 페이지에서는 Nav를 숨김
  const showNav = !['/auth', '/'].includes(location.pathname);

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
          {/* Public Routes */}
          <Route path="/" element={<Intro />} />
          <Route path="/auth" element={<><Login /><SignUp /></>} />
          
          {/* Protected Routes */}
          <Route path="/device" element={
            <ProtectedRoute>
              <DeviceList />
            </ProtectedRoute>
          }/>
          <Route path="/addDevice" element={
            <ProtectedRoute>
              <AddDevice />
            </ProtectedRoute>
          } />
          <Route path="/updateDevice/:publicKey" element={
            <ProtectedRoute>
              <UpdateDevice />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;