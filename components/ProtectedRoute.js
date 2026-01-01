import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/components/ProtectedRoute.module.css';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isLoginPage = router.pathname === '/login';
      
      // Verificar se está autenticado
      const authenticated = localStorage.getItem('authenticated') === 'true';
      
      
      const sessionExpiration = localStorage.getItem('sessionExpiration');
      const isSessionExpired = sessionExpiration && Date.now() > parseInt(sessionExpiration);

      // Se a sessão expirou, limpar tudo e redirecionar para login
      if (authenticated && isSessionExpired) {
        localStorage.clear();
        router.push('/login');
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      if (!isLoginPage && !authenticated) {
        router.push('/login');
        setIsAuthenticated(false);
      } else if (isLoginPage && authenticated) {
        router.push('/');
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(authenticated);
      }
      setIsChecking(false);
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router.pathname]);

  
  if (isChecking) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Verificando autenticação...</p>
      </div>
    );
  }

  // Se não está autenticado e não é página de login, não renderizar
  const isLoginPage = router.pathname === '/login';
  if (!isAuthenticated && !isLoginPage) {
    return null; 
  }

  // Se está autenticado e é página de login, não renderizar
  if (isAuthenticated && isLoginPage) {
    return null;
  }

  
  return children;
}

