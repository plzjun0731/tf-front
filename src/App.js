import React, { useState } from 'react';
import LoginPage from './component/LoginPage';
import AdminFrame from './component/adminpages/AdminFrame';
import GuestFrame from './component/guestpages/GuestFrame';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' 또는 'guest'

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setIsLoggedIn(false);
      setUserRole(null);
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (userRole === 'admin') {
    return <AdminFrame onLogout={handleLogout} />;
  } else if (userRole === 'guest') {
    return <GuestFrame onLogout={handleLogout} />; 
  }

  return <div>Loading...</div>; // 초기 로딩 상태 또는 오류 처리
}

export default App;