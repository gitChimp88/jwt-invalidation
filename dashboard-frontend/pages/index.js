import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return <p>Loading...</p>;
};

export default Home;
