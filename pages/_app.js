import '../styles/globals.css';
import ProtectedRoute from '../components/ProtectedRoute';

export default function App({ Component, pageProps }) {
  return (
    <ProtectedRoute>
      <Component {...pageProps} />
    </ProtectedRoute>
  );
}

