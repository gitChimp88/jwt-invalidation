import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import request from '../utils/request';

const Dashboard = () => {
  const { isAuthenticated, userInfo, logout, token, loading } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const userName = userInfo?.username;

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      }

      if (token) {
        fetchData();
      }
    }
  }, [isAuthenticated, loading]);

  const fetchData = async () => {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await request(
        'http://localhost:1337/api/examples',
        options
      );
      setData(data);
    } catch (err) {
      setError(err);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading data...</div>;
  }

  console.log('JWT here - ', token);

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Welcome to the dashboard! {userName}</p>
      <button onClick={logout}>Logout</button>

      <h1>Examples</h1>
      {data.map((val) => (
        <div
          style={{ padding: '10px', border: '1px solid black', margin: '10px' }}
          key={val.id}
        >
          {val.attributes.info}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
