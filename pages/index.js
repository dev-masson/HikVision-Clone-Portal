import Head from 'next/head';
import Header from '../components/Header';
import SearchSection from '../components/SearchSection';
import Footer from '../components/Footer';
import styles from '../styles/pages/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Hikvision – Portal de Arquivos</title>
        <meta name="description" content="Portal de Arquivos Hikvision - Busque documentos de configuração, manuais e softwares para seus dispositivos Hikvision" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.appContainer}>
        <Header />
        <SearchSection />
        <Footer />
      </div>
    </>
  );
}
