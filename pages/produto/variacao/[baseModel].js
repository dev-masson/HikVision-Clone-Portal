import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import styles from '../../../styles/pages/ProductVariation.module.css';

export default function ProductVariation() {
  const router = useRouter();
  const { baseModel } = router.query;
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [baseModelName, setBaseModelName] = useState('');

  useEffect(() => {
    if (baseModel) {
      loadVariations();
    }
  }, [baseModel]);

  const loadVariations = async () => {
    try {
      setLoading(true);
      const searchKey = decodeURIComponent(baseModel);
      setBaseModelName(searchKey);
      
      // Busca todos os produtos que correspondem ao modelo base ou groupName
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchKey)}`);
      const data = await response.json();
      
      if (data.success) {
        // Filtra apenas produtos que têm o mesmo modelo base ou groupName
        const matchingProducts = data.products.filter(product => {
          if (product.hasVariations) {
            
            return product.groupName === searchKey || product.baseModel === searchKey;
          }
          
          const productBase = product.model.replace(/\s*\([^)]+\)\s*$/, '').trim();
          return productBase === searchKey;
        });
        
        
        if (matchingProducts.length > 0 && matchingProducts[0].hasVariations) {
          const grouped = matchingProducts[0];
          
          
          const batchResponse = await fetch('/api/products/batch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ models: grouped.variations })
          });
          
          const batchData = await batchResponse.json();
          
          if (batchData.success && batchData.products) {
            setVariations(batchData.products);
          }
        } else {
          // Fallback: usa os produtos encontrados
          setVariations(matchingProducts);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar variações:', error);
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
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <div className={styles.appContainer}>
          <Header />
          <main className={styles.main}>
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Carregando variações...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!loading && variations.length === 0) {
    return (
      <>
        <Head>
          <title>Nenhuma variação encontrada | Hikvision</title>
        </Head>
        <div className={styles.appContainer}>
          <Header />
          <main className={styles.main}>
            <div className={styles.error}>
              <h1>😕 Nenhuma variação encontrada</h1>
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
        <title>Selecione a variação - {baseModelName} | Hikvision</title>
        <meta name="description" content={`Escolha a variação do dispositivo ${baseModelName}`} />
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

            {/* Título */}
            <div className={styles.header}>
              <h1 className={styles.title}>Selecione a variação do dispositivo</h1>
              <p className={styles.subtitle}>{baseModelName}</p>
              <p className={styles.variationCount}>
                {variations.length} {variations.length === 1 ? 'variação disponível' : 'variações disponíveis'}
              </p>
            </div>

            {/* Grid de Variações - Usando ProductCard */}
            <div className={styles.productsGrid}>
              {variations.map((variation) => (
                <ProductCard key={variation.model} product={variation} />
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

