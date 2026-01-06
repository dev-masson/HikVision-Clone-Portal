import { useState } from 'react';
import styles from '../styles/components/ProductCard.module.css';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  

  const hasVariations = product.hasVariations || false;
  const name = (hasVariations && product.groupName) ? product.groupName : (product.model || 'Sem nome');
  const imageUrl = product.thumbnail || null;
  const variationsCount = product.variationsCount || 0;
  

  // Para produtos com groupName, usa o groupName como identificador na URL
  const variationKey = product.groupName ? encodeURIComponent(product.groupName) : encodeURIComponent(product.baseModel || product.model);
  const productUrl = hasVariations 
    ? `/produto/variacao/${variationKey}`
    : `/produto/${encodeURIComponent(product.model)}`;

  const firmwareCount = product._fileCounts?.firmwares ?? (product.files?.firmwares?.length || 0);
  const documentCount = product._fileCounts?.totalDocuments ?? ((product.files?.documents?.length || 0) + (product.files?.videos?.length || 0));

  return (
    <a href={productUrl} className={styles.card}>
      <div className={styles.imageContainer}>
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={name}
            className={styles.productImage}
            crossOrigin={imageUrl.startsWith('http') ? 'anonymous' : undefined}
            onError={() => {
              console.error('Erro ao carregar imagem:', imageUrl);
              setImageError(true);
            }}
            onLoad={() => console.log('Imagem carregada:', imageUrl)}
          />
        ) : (
          <div className={styles.placeholderImage}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}
        
        {/* Badge de variações */}
        {hasVariations && variationsCount > 1 && (
          <div className={styles.variationBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            {variationsCount} variações
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.productName}>{name}</h3>
        
        <div className={styles.stats}>
          <span className={styles.stat} title="Firmwares">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="16" x="4" y="4" rx="2"/>
              <rect width="6" height="6" x="9" y="9" rx="1"/>
              <path d="M9 2v2M9 20v2M15 2v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>
            </svg>
            {firmwareCount}
          </span>
          
          <span className={styles.stat} title="Documentos">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            {documentCount}
          </span>
        </div>
      </div>
      
      <div className={styles.overlay}>
        <span>{hasVariations ? 'Selecionar variação' : 'Ver detalhes'}</span>
      </div>
    </a>
  );
}

