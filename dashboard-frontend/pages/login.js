import styles from '../styles/Home.module.css';
import SignOnButton from '../components/SignOnButton';

const Login = () => {
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>Provider example</h1>
        <SignOnButton provider={'google'} />
      </main>
    </div>
  );
};

export default Login;
