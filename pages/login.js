import { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/pages/Login.module.css';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Gerar partículas apenas uma vez (não regenerar a cada digitação)
  const particles = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 1.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 10,
      tx: Math.random() * 500 - 250,
      ty: Math.random() * 1000 - 500,
    }));
  }, []); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação básica
    if (!formData.username || !formData.password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }


    await new Promise(resolve => setTimeout(resolve, 1500));


    const validUsername = process.env.NEXT_PUBLIC_LOGIN_USER;
    const validPassword = process.env.NEXT_PUBLIC_LOGIN_PASS;

    if (formData.username === validUsername && formData.password === validPassword) {

      const expirationTime = Date.now() + (12 * 60 * 60 * 1000); // 12 horas 
      
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('sessionExpiration', expirationTime.toString());
      localStorage.setItem('user', JSON.stringify({ 
        username: formData.username,
        name: 'admin'
      }));
      
      router.push('/');
    } else {
      setError('Usuário ou senha inválidos');
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Login - Hikvision Portal</title>
        <meta name="description" content="Faça login no Portal de Arquivos Hikvision" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logoSection}>
            <img 
              src="/logo-hikvision.svg" 
              alt="Hikvision Logo" 
              className={styles.logo}
            />
            <h1 className={styles.title}>Portal de Arquivos</h1>
            <p className={styles.subtitle}>Entre com suas credenciais</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>
                Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={styles.input}
                placeholder="username"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Senha
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H7v-2h2v2zm0-3H7V4h2v6z"/>
                </svg>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        <div className={styles.background}>
          {/* Partículas fixas (não regeneram a cada digitação) */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={styles.particle}
              style={{
                '--size': `${particle.size}px`,
                '--left': `${particle.left}%`,
                '--top': `${particle.top}%`,
                '--duration': `${particle.duration}s`,
                '--delay': `${particle.delay}s`,
                '--tx': `${particle.tx}px`,
                '--ty': `${particle.ty}px`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

