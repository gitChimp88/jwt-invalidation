import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import request from '../../utils/request';

export default function ConnectProvider() {
  const router = useRouter();
  const { provider } = router.query;
  const { setToken, setUserInfo } = useAuth();

  useEffect(() => {
    if (!provider) return;

    const fetchData = async () => {
      const search = window.location.search;
      const requestURL = `http://localhost:1337/api/auth/${provider}/callback${search}`;

      try {
        const response = await request(requestURL, {
          method: 'GET',
          credentials: 'include',
        });
        console.log('JWT - ', response.jwt);
        console.log('USER - ', response.user);
        setToken(response.jwt, true);
        setUserInfo(response.user, true);
        router.push('/');
      } catch (err) {
        console.log(err.response);
        router.push('/login');
      }
    };

    fetchData();
  }, [provider]);

  return (
    <div>
      <h1>...Loading</h1>
    </div>
  );
}
