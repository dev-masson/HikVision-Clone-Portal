import styles from '../styles/components/SoftwareCard.module.css';

export default function SoftwareCard({ software }) {
  const name = software.name || software.title || 'Sem nome';
  const description = software.description || '';
  const softwareId = software.id || software.name || software.title;
  const softwareUrl = `/software/${encodeURIComponent(softwareId)}`;
  const thumbnail = software.thumbnail || null;

  return (
    <a 
      href={softwareUrl}
      className={styles.card}
    >
      <div className={styles.imageContainer}>
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={name}
            className={styles.thumbnail}
            crossOrigin={thumbnail.startsWith('http') ? 'anonymous' : undefined}
          />
        ) : (
          <div className={styles.placeholderImage}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect width="16" height="16" x="4" y="4" rx="2"/>
              <rect width="6" height="6" x="9" y="9" rx="1"/>
              <path d="M9 2v2M9 20v2M15 2v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>
            </svg>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>
      
      <div className={styles.overlay}>
        <span>Ver detalhes</span>
      </div>
    </a>
  );
}

