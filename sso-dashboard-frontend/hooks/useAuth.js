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

  const blacklistToken = async (token) => {
    const payload = {
      data: {
        token,
      },
    };

    try {
      const res = await fetch('http://localhost:1337/api/token-blacklists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to blacklist token: ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error blacklisting token:', error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      if (token) {
        await blacklistToken(token);
      }

      setIsAuthenticated(false);
      setTokenState(null);
      setUserInfoState(null);
      clearAuthData();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [router, token]);

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
