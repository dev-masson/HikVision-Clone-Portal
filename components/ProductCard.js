import { useState } from 'react';
import styles from '../styles/components/ProductCard.module.css';

export default function ProductCard({ product }) {

  const name = product.model || 'Sem nome';
  const imageUrl = product.thumbnail || null;
  const productUrl = `/produto/${encodeURIComponent(product.model)}`;
  const [imageError, setImageError] = useState(false);
  

  const firmwareCount = product._fileCounts?.firmwares ?? (product.files?.firmwares?.length || 0);
  const documentCount = product._fileCounts?.totalDocuments ?? ((product.files?.documents?.length || 0) + (product.files?.videos?.length || 0));

  return (
    <div className={styles.card}>
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
      
      <a href={productUrl} className={styles.overlay}>
        <span>Ver detalhes</span>
      </a>
    </div>
  );
}

