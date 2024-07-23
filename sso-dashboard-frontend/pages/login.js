import styles from '../styles/Home.module.css';
import SsoButton from '../components/SsoButton';

const Login = () => {
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>SSO example</h1>
        <SsoButton provider={'google'} />
      </main>
    </div>
  );
};

export default Login;
