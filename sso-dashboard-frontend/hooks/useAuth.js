import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const storeAuthData = (type, token, user) => {
  if (type === 'jwt') {
    localStorage.setItem('jwt', token);
  } else {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }
};

const getAuthData = () => {
  const token = localStorage.getItem('jwt');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return { token, userInfo };
};

const clearAuthData = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('userInfo');
};

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(null);
  const [userInfo, setUserInfoState] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { token: storedToken, userInfo: storedUserInfo } = getAuthData();
    if (storedToken) {
      setTokenState(storedToken);
      setUserInfoState(storedUserInfo);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const setToken = useCallback(
    (jwt, persist) => {
      setTokenState(jwt);
      if (persist) {
        storeAuthData('jwt', jwt, userInfo);
      }
    },
    [userInfo]
  );

  const setUserInfo = useCallback(
    (user, persist) => {
      setUserInfoState(user);
      if (persist) {
        storeAuthData('userInfo', token, user);
      }
    },
    [token]
  );

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setTokenState(null);
    setUserInfoState(null);
    clearAuthData();
    router.push('/login');
  }, [router]);

  return {
    isAuthenticated,
    login,
    logout,
    setToken,
    setUserInfo,
    loading,
    token,
    userInfo,
  };
};

export default useAuth;
