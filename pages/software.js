import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SoftwareCard from '../components/SoftwareCard';
import styles from '../styles/pages/Software.module.css';

export default function Software() {
  const router = useRouter();
  const [softwares, setSoftwares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSoftwares();
  }, []);

  const loadSoftwares = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/softwares/search');
      const data = await response.json();
      
      if (data.success) {
        setSoftwares(data.softwares);
      }
    } catch (error) {
      console.error('Erro ao carregar softwares:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Software | Hikvision – Portal de Arquivos</title>
        <meta name="description" content="Softwares e ferramentas Hikvision - Download de aplicativos, utilitários e programas para dispositivos Hikvision" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.appContainer}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <button onClick={handleBack} className={styles.btnBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Voltar
            </button>
            <div className={styles.header}>
              <h1 className={styles.title}>Software</h1>
              <p className={styles.subtitle}>
                Acesse os softwares e ferramentas disponíveis para dispositivos Hikvision
              </p>
            </div>

            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Carregando softwares...</p>
              </div>
            ) : softwares.length === 0 ? (
              <div className={styles.empty}>
                <p>Nenhum software encontrado.</p>
              </div>
            ) : (
              <div className={styles.softwaresGrid}>
                {softwares.map((software, index) => (
                  <SoftwareCard key={software.id || software.name || index} software={software} />
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

