import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.auth.loginState);

  useEffect(() => {
    if (!loginState) {
      navigate('/', { replace: true });
    }
  }, [loginState, navigate]);

  return loginState ? children : null;
};

export default ProtectedRoute;