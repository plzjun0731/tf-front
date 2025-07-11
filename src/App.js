import React, { useState, useEffect } from 'react';
import LoginPage from './component/LoginPage';
import AdminFrame from './component/adminpages/AdminFrame';
import GuestFrame from './component/guestpages/GuestFrame';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' 또는 'guest'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedLoginStatus = sessionStorage.getItem('isLoggedIn');
        const savedUserRole = sessionStorage.getItem('userRole');
        
        if (savedLoginStatus === 'true' && savedUserRole) {
          setIsLoggedIn(true);
          setUserRole(savedUserRole);
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류:', error);
        // 오류 발생 시 저장된 정보 삭제
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userRole');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = (role) => {
    try {
      setIsLoggedIn(true);
      setUserRole(role);
      
      // sessionStorage에 로그인 정보 저장
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userRole', role);
    } catch (error) {
      console.error('로그인 정보 저장 중 오류:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // 모든 저장소 정리
      localStorage.clear();
      sessionStorage.clear();
      // 상태 초기화
      setIsLoggedIn(false);
      setUserRole(null);
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      // 오류가 발생해도 로그아웃 처리
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