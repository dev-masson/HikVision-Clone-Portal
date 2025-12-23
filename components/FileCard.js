import { useState } from 'react';
import styles from '../styles/components/FileCard.module.css';

export default function FileCard({ file, viewMode = 'cards' }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = file.downloadUrl || file.url || '';
    const fileName = file.name || 'Link';
    
    if (url) {
      
      const success = await copyFormattedLink(url, fileName);
      
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback: copia apenas o texto
        copyToClipboardFallback(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const copyFormattedLink = async (url, fileName) => {
    
    if (navigator.clipboard && navigator.clipboard.write) {
      try {
        const htmlContent = `<a href="${url}">${fileName}</a>`;
        const textContent = url;
        
        const clipboardItem = new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([textContent], { type: 'text/plain' })
        });
        
        await navigator.clipboard.write([clipboardItem]);
        return true;
      } catch (err) {
        // Continua para o próximo método se falhar
      }
    }
    
    
    try {
      
      const tempDiv = document.createElement('div');
      tempDiv.contentEditable = true;
      tempDiv.style.cssText = `
        position: fixed;
        left: -9999px;
        top: -9999px;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        background: transparent !important;
        color: inherit;
      `;
      
      const link = document.createElement('a');
      link.href = url;
      link.textContent = fileName;
      link.style.cssText = 'background: transparent !important; color: #0000EE; text-decoration: underline;';
      
      tempDiv.appendChild(link);
      document.body.appendChild(tempDiv);
      

      const range = document.createRange();
      range.selectNode(link);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      

      const successful = document.execCommand('copy');
      

      selection.removeAllRanges();
      document.body.removeChild(tempDiv);
      
      if (successful) {
        return true;
      }
    } catch (err) {
      console.error('Erro ao copiar link formatado:', err);
    }
    
    return false;
  };

  const copyToClipboardFallback = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Erro ao copiar para a área de transferência:', err);
    }
  };
  const getFileIcon = (type) => {
    switch (type) {
      case 'firmware':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="16" height="16" x="4" y="4" rx="2"/>
            <rect width="6" height="6" x="9" y="9" rx="1"/>
            <path d="M9 2v2M9 20v2M15 2v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>
          </svg>
        );
      case 'image':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        );
      case 'video':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        );
      case 'pdf':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <text x="8" y="17" fontSize="6" fill="currentColor">PDF</text>
          </svg>
        );
      default:
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
        );
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    // Valida formato YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return null;
    
    const [year, month, day] = dateString.split('-');
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    

    if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) return null;
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (
      date.getFullYear() !== yearNum ||
      date.getMonth() !== monthNum - 1 ||
      date.getDate() !== dayNum
    ) {
      return null;
    }
    
    return date.toLocaleDateString('pt-BR');
  };

  if (viewMode === 'list') {
    const downloadUrl = file.downloadUrl || file.url || '#';
    const formattedDate = file.date ? formatDate(file.date) : null;
    
    return (
      <div className={styles.listItem}>
        <div className={styles.listIcon}>
          {getFileIcon(file.type)}
        </div>
        <div className={styles.listInfo}>
          <span className={styles.listName}>{file.name}</span>
          {file.description && (
            <span className={styles.listDescription}>{file.description}</span>
          )}
          {formattedDate && (
            <span className={styles.listMeta}>
              Adicionado em: {formattedDate}
            </span>
          )}
        </div>
        <div className={styles.listActions}>
          <button 
            className={styles.copyButton}
            onClick={handleCopyLink}
            title={copied ? "Link copiado!" : "Copiar link"}
          >
            {copied ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
          <button 
            className={styles.downloadButton}
            onClick={(e) => {
              e.stopPropagation();
              window.open(downloadUrl, '_blank', 'noopener,noreferrer');
            }}
            title="Download"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = file.date ? formatDate(file.date) : null;
  
  return (
    <a 
      href={file.downloadUrl || file.url || '#'} 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.card}
    >
      <div className={styles.cardIcon}>
        {file.thumbnail ? (
          <img src={file.thumbnail} alt={file.name} className={styles.thumbnail} />
        ) : (
          getFileIcon(file.type)
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{file.name}</h3>
        <div className={styles.cardMeta}>
          <span>{formatFileSize(file.size)}</span>
          {formattedDate && <span>{formattedDate}</span>}
        </div>
      </div>
      <div className={styles.cardOverlay}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Download</span>
      </div>
    </a>
  );
}

