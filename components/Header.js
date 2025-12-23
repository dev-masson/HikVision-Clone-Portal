import { useState } from 'react';
import styles from '../styles/components/Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <a href="/" className={styles.logoLink}>
          <img 
            src="/logo-hikvision.svg" 
            alt="Hikvision – logo" 
            width="180" 
            height="50"
          />
        </a>
        
        <nav className={styles.navDesktop}>
          <a href="/" className={styles.navLink}>Dispositivos</a>
          <a href="/software" className={styles.navLink}>Softwares</a>
          <a href="#ferramentas" className={styles.navLink}>Ferramenta</a>
        </nav>

        <button 
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {menuOpen && (
          <nav className={styles.navMobile}>
            <a href="/" className={styles.navLinkMobile}>Dispositivos</a>
            <a href="/software" className={styles.navLinkMobile}>Softwares</a>
            <a href="#ferramentas" className={styles.navLinkMobile}>Ferramenta</a>
          </nav>
        )}
      </div>
    </header>
  );
}

