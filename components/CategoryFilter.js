import styles from '../styles/components/CategoryFilter.module.css';

const categories = [
  'Todas',
  'Access Point',
  'Alarmes',
  'APP',
  'Câmeras',
  'Controle de Acesso',
  'Corneta',
  'DVR',
  'Master Station',
  'NVR',
  'Radar',
  'Switch',
  'Tela Interativa',
  'Video Porteiro'
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className={styles.filterContainer}>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

