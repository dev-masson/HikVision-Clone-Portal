import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FileCard from '../../components/FileCard';
import styles from '../../styles/pages/ProductDetail.module.css';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [files, setFiles] = useState({ firmwares: [], images: [], documents: [], videos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProductData();
    }
  }, [id]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados do produto (id na rota é na verdade o modelo)
      const model = decodeURIComponent(id);
      const response = await fetch('/api/products/' + encodeURIComponent(model));
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.product);
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Carregando... | Hikvision</title>
        </Head>
        <div className={styles.appContainer}>
          <Header />
          <main className={styles.main}>
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Carregando produto...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Head>
          <title>Produto não encontrado | Hikvision</title>
        </Head>
        <div className={styles.appContainer}>
          <Header />
          <main className={styles.main}>
            <div className={styles.error}>
              <h1>😕 Produto não encontrado</h1>
              <button onClick={handleBack} className={styles.btnBack}>
                Voltar
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{product.model} | Hikvision</title>
        <meta name="description" content={`Arquivos e documentação do produto ${product.model}`} />
      </Head>

      <div className={styles.appContainer}>
        <Header />

        <main className={styles.main}>
          <div className={styles.container}>
            {/* Botão Voltar */}
            <button onClick={handleBack} className={styles.btnBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Voltar
            </button>

            {/* Imagem do Produto */}
            <section className={styles.productImageSection}>
              <div className={styles.productImageContainer}>
                {product.thumbnail ? (
                  <img 
                    src={product.thumbnail} 
                    alt={`Imagem do produto ${product.model}`}
                    className={styles.productImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <p>{product.model}</p>
                  </div>
                )}
              </div>
              <h1 className={styles.productTitle}>{product.model}</h1>
              <p className={styles.productCategory}>{product.category}</p>
            </section>

            {/* Seção de Firmwares (PRIMEIRA LISTA) */}
            {files.firmwares.length > 0 && (
              <section className={styles.filesSection}>
                <h2 className={styles.sectionTitle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {/* Símbolo </> */}
                    <path d="M8 9 L10 12 L8 15" stroke="currentColor" fill="none"></path>
                    <path d="M16 9 L14 12 L16 15" stroke="currentColor" fill="none"></path>
                    <line x1="11" y1="12" x2="13" y2="12" stroke="currentColor"></line>
                  </svg>
                  Firmwares ({files.firmwares.length})
                </h2>
                <div className={styles.filesList}>
                  {files.firmwares.map((file, index) => (
                    <FileCard key={index} file={file} viewMode="list" />
                  ))}
                </div>
              </section>
            )}

            {/* Seção de Documentos (SEGUNDA LISTA) */}
            {files.documents.length > 0 && (
              <section className={styles.filesSection}>
                <h2 className={styles.sectionTitle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  Documentos ({files.documents.length})
                </h2>
                <div className={styles.filesList}>
                  {files.documents.map((file, index) => (
                    <FileCard key={index} file={file} viewMode="list" />
                  ))}
                </div>
              </section>
            )}

            {/* Seção de Arquivos/Imagens */}
            {files.images.length > 0 && (
              <section className={styles.filesSection}>
                <h2 className={styles.sectionTitle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Imagens ({files.images.length})
                </h2>
                <div className={styles.filesList}>
                  {files.images.map((file, index) => (
                    <FileCard key={index} file={file} viewMode="list" />
                  ))}
                </div>
              </section>
            )}

            {/* Seção de Vídeos */}
            {files.videos.length > 0 && (
              <section className={styles.filesSection}>
                <h2 className={styles.sectionTitle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  Vídeos ({files.videos.length})
                </h2>
                <div className={styles.filesList}>
                  {files.videos.map((file, index) => (
                    <FileCard key={index} file={file} viewMode="list" />
                  ))}
                </div>
              </section>
            )}

            {/* Sem arquivos */}
            {files.firmwares.length === 0 && files.images.length === 0 && files.documents.length === 0 && files.videos.length === 0 && (
              <div className={styles.noFiles}>
                <p>📁 Nenhum arquivo disponível para este produto.</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

