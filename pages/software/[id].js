import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FileCard from '../../components/FileCard';
import styles from '../../styles/pages/SoftwareDetail.module.css';

export default function SoftwareDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [software, setSoftware] = useState(null);
  const [files, setFiles] = useState({ firmwares: [], images: [], documents: [], videos: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSoftwareData();
    }
  }, [id]);

  const loadSoftwareData = async () => {
    try {
      setLoading(true);
      
      
      const softwareId = decodeURIComponent(id);
      const response = await fetch('/api/softwares/' + encodeURIComponent(softwareId));
      const data = await response.json();
      
      if (data.success) {
        setSoftware(data.software);
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Erro ao carregar software:', error);
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
              <p>Carregando software...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!software) {
    return (
      <>
        <Head>
          <title>Software não encontrado | Hikvision</title>
        </Head>
        <div className={styles.appContainer}>
          <Header />
          <main className={styles.main}>
            <div className={styles.error}>
              <h1>😕 Software não encontrado</h1>
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

  const softwareName = software.name || software.title || 'Software';
  const softwareVersion = software.version ? `v${software.version}` : '';

  return (
    <>
      <Head>
        <title>{softwareName} {softwareVersion} | Hikvision</title>
        <meta name="description" content={`Arquivos e downloads do software ${softwareName}`} />
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

            {/* Imagem do Software */}
            <section className={styles.softwareImageSection}>
              <div className={styles.softwareImageContainer}>
                {software.thumbnail ? (
                  <img 
                    src={software.thumbnail} 
                    alt={`Imagem do software ${softwareName}`}
                    className={styles.softwareImage}
                    crossOrigin={software.thumbnail.startsWith('http') ? 'anonymous' : undefined}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect width="16" height="16" x="4" y="4" rx="2"/>
                      <rect width="6" height="6" x="9" y="9" rx="1"/>
                      <path d="M9 2v2M9 20v2M15 2v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>
                    </svg>
                    <p>{softwareName}</p>
                  </div>
                )}
              </div>
              <h1 className={styles.softwareTitle}>{softwareName}</h1>
              {softwareVersion && (
                <p className={styles.softwareVersion}>{softwareVersion}</p>
              )}
              {software.category && (
                <p className={styles.softwareCategory}>{software.category}</p>
              )}
              {software.description && (
                <p className={styles.softwareDescription}>{software.description}</p>
              )}
            </section>

            {/* Seção de Downloads/Firmwares */}
            {files.firmwares.length > 0 && (
              <section className={styles.filesSection}>
                <h2 className={styles.sectionTitle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="16" height="16" x="4" y="4" rx="2"/>
                    <rect width="6" height="6" x="9" y="9" rx="1"/>
                    <path d="M9 2v2M9 20v2M15 2v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>
                  </svg>
                  Downloads ({files.firmwares.length})
                </h2>
                <div className={styles.filesList}>
                  {files.firmwares.map((file, index) => (
                    <FileCard key={index} file={file} viewMode="list" />
                  ))}
                </div>
              </section>
            )}

            {/* Seção de Documentos */}
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

            {/* Seção de Imagens */}
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
                <p>📁 Nenhum arquivo disponível para este software.</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

