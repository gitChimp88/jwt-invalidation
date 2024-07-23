import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const renderApp = () => {
    return <Component {...pageProps} />;
  };
  return renderApp();
}

export default MyApp;
