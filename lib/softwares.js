// Biblioteca de utilitários para softwares
const fs = require('fs');
const path = require('path');

/**
 * Função auxiliar para ler recursivamente arquivos JSON
 * @param {string} dirPath - Caminho do diretório
 * @param {Array} allSoftwares - Array para acumular softwares
 */
function readJsonFilesRecursively(dirPath, allSoftwares) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        
        readJsonFilesRecursively(itemPath, allSoftwares);
      } else if (stat.isFile() && item.endsWith('.json')) {
        
        try {
          const fileData = fs.readFileSync(itemPath, 'utf8');
          const softwares = JSON.parse(fileData);
          if (Array.isArray(softwares)) {
            allSoftwares.push(...softwares);
          } else if (typeof softwares === 'object' && softwares !== null) {
            
            allSoftwares.push(softwares);
          }
        } catch (error) {
          console.error(`Erro ao ler arquivo ${itemPath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Erro ao ler diretório ${dirPath}:`, error);
  }
}

/**
 * Carrega todos os softwares da pasta data/softwares
 * @returns {Array} Array com todos os softwares
 */
export function getAllSoftwares() {
  const softwaresDir = path.join(process.cwd(), 'data', 'softwares');
  const allSoftwares = [];
  
  try {
    if (!fs.existsSync(softwaresDir)) {
      return [];
    }
    
    readJsonFilesRecursively(softwaresDir, allSoftwares);
    
    return allSoftwares;
  } catch (error) {
    console.error('Erro ao carregar softwares:', error);
    return [];
  }
}

/**
 * Busca softwares por nome ou descrição
 * @param {string} query - Termo de busca
 * @param {string} category - Categoria opcional para filtrar
 * @returns {Array} Array de softwares filtrados
 */
export function searchSoftwares(query = '', category = null) {
  const allSoftwares = getAllSoftwares();
  
  if (!query && !category) {
    return allSoftwares;
  }
  
  const queryLower = query.toLowerCase().trim();
  
  let filtered = allSoftwares;
  
  // Filtra por categoria se fornecida
  if (category) {
    filtered = filtered.filter(software => 
      software.category && software.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  
  if (queryLower) {
    filtered = filtered.filter(software => {
      const name = (software.name || software.title || '').toLowerCase();
      const description = (software.description || '').toLowerCase();
      const version = (software.version || '').toLowerCase();
      const category = (software.category || '').toLowerCase();
      
      return name.includes(queryLower) || 
             description.includes(queryLower) || 
             version.includes(queryLower) ||
             category.includes(queryLower);
    });
  }
  
  return filtered;
}

/**
 * Busca um software por ID ou nome
 * @param {string} id - ID ou nome do software
 * @returns {Object|null} Software encontrado ou null
 */
export function getSoftwareById(id) {
  const softwares = getAllSoftwares();
  return softwares.find(s => s.id === id || s.name === id || s.title === id) || null;
}

/**
 * Retorna os arquivos de um software (similar a getProductFiles)
 * @param {Object} software - Objeto do software
 * @returns {Object} Objeto com arrays de arquivos
 */
export function getSoftwareFiles(software) {
  const softwareFiles = software.files || {};
  
  return {
    firmwares: softwareFiles.firmwares || [],
    images: softwareFiles.images || [],
    documents: softwareFiles.documents || [],
    videos: softwareFiles.videos || []
  };
}

