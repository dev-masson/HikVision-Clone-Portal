import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/components/SearchSection.module.css';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

export default function SearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Restaurar busca da URL quando componente carregar
  useEffect(() => {
    const { q, category } = router.query;
    
    if (q) {
      setQuery(q);
    }
    
    if (category) {
      setSelectedCategory(category);
    } else {
      // Se não houver categoria na URL, usar "Todas"
      setSelectedCategory('Todas');
    }
    
 
    if (q || category) {
      performSearch(q || '', category || 'Todas');
    } else {
      // Se não houver parâmetros, carregar todos os produtos (categoria "Todas")
      performSearch('', 'Todas');
    }
  }, [router.query.q, router.query.category]);

  const performSearch = async (searchQuery = '', category = 'Todas') => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Monta URL com query (se houver) e categoria
      let url = '/api/products/search?';
      if (searchQuery && searchQuery.trim()) {
        url += `q=${encodeURIComponent(searchQuery)}`;
      }
      if (category !== 'Todas') {
        url += (url.endsWith('?') ? '' : '&') + `category=${encodeURIComponent(category)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || 'Erro ao buscar produtos');
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setError('Erro ao buscar produtos. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    
    // Se não tem query nem categoria selecionada, limpa tudo
    if (!query.trim() && selectedCategory === 'Todas') {
      router.push({
        pathname: '/',
        query: {}
      }, undefined, { shallow: true });
      

      setResults(null);
      setError(null);
      setQuery('');
      setSelectedCategory('Todas');
      return;
    }

    // Atualizar URL com parâmetros de busca
    router.push({
      pathname: '/',
      query: { 
        ...(query.trim() && { q: query }),
        ...(selectedCategory !== 'Todas' && { category: selectedCategory })
      }
    }, undefined, { shallow: true });


    await performSearch(query, selectedCategory);
  };

  // Re-buscar quando categoria mudar
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    // Atualizar URL
    router.push({
      pathname: '/',
      query: { 
        ...(query.trim() && { q: query }),
        ...(category !== 'Todas' && { category: category })
      }
    }, undefined, { shallow: true });

    // Buscar automaticamente quando categoria mudar (com ou sem query)
    performSearch(query, category);
  };

  const handleHelp = () => {
    alert('Digite o modelo do dispositivo (ex: DS-KIT342MX, DS-2CD2042WD) para encontrar produtos Hikvision.');
  };

  const handleNotFound = () => {
    const requestUrl = 'https://app.slack.com/client/T01HUTWJD7Y/D07LTP1LC76';
    window.open(requestUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Barra de Busca */}
        <section className={styles.searchBox}>
          <h1 className={styles.title}>Buscar arquivos</h1>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Digite o modelo do dispositivo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className={styles.btnSearch} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
            <button type="button" className={styles.btnHelp} onClick={handleHelp}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Ajuda
            </button>
            <button type="button" className={styles.btnNotFound} onClick={handleNotFound}>
              Não Encontrei
            </button>
          </form>
        </section>

        {/* Filtros de Categoria - Sempre visível */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* Erro */}
        {error && (
          <div className={styles.errorBox}>
            <h3>❌ Erro</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Resultados */}
        {results && results.total > 0 && (
          <section className={styles.resultsSection}>
            <div className={styles.productsGrid}>
              {results.products.map((product) => (
                <ProductCard key={product.model} product={product} />
              ))}
            </div>
            
            {/* Paginação */}
            <div className={styles.pagination}>
              <span>Página 1 de 1</span>
              <div className={styles.paginationButtons}>
                <button disabled>Anterior</button>
                <button disabled>Próxima</button>
              </div>
            </div>
          </section>
        )}

        {/* Sem resultados */}
        {results && results.total === 0 && (
          <div className={styles.noResults}>
            <p>😕 Nenhum produto encontrado com esse termo.</p>
            <button className={styles.btnNotFound} onClick={handleNotFound}>
              Solicitar Produto
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
