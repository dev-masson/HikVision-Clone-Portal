// Biblioteca de utilitários para produtos
const fs = require('fs');
const path = require('path');

/**
 * Função auxiliar para ler recursivamente arquivos JSON
 * @param {string} dirPath - Caminho do diretório
 * @param {Array} allProducts - Array para acumular produtos
 */
function readJsonFilesRecursively(dirPath, allProducts) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Se é uma pasta, entra recursivamente
        readJsonFilesRecursively(itemPath, allProducts);
      } else if (stat.isFile() && item.endsWith('.json')) {
        // Se é um arquivo JSON, lê e adiciona produtos
        try {
          const fileData = fs.readFileSync(itemPath, 'utf8');
          const products = JSON.parse(fileData);
          if (Array.isArray(products)) {
            allProducts.push(...products);
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
 * @returns {Array} 
 */
export function getAllProducts() {
  const productsDir = path.join(process.cwd(), 'data', 'products');
  const allProducts = [];
  
  try {

    if (!fs.existsSync(productsDir)) {
      // Fallback: tenta ler o arquivo antigo products.json
      const oldProductsPath = path.join(process.cwd(), 'data', 'products.json');
      if (fs.existsSync(oldProductsPath)) {
        const productsData = fs.readFileSync(oldProductsPath, 'utf8');
        return JSON.parse(productsData);
      }
      return [];
    }
    
    readJsonFilesRecursively(productsDir, allProducts);
    
    return allProducts;
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return [];
  }
}

/**
 * @param {string} model - 
 * @returns {Object|null} 
 */
export function getProductByModel(model) {
  const products = getAllProducts();
  return products.find(p => p.model === model) || null;
}

/**

 * @param {string} id - 
 * @returns {Object|null} 
 */
export function getProductById(id) {
  const products = getAllProducts();
  // Tenta buscar por ID primeiro, depois por modelo
  return products.find(p => p.id === id || p.model === id) || null;
}

/**
 * 
 * @param {string} query
 * @param {string} category 
 * @returns {Array}
 */
export function searchProducts(query = '', category = null) {
  const products = getAllProducts();
  
  let filtered = products;
  
  // Se houver query, filtra por modelo
  if (query && query.trim()) {
    filtered = filtered.filter(product => 
      product.model.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Se houver categoria, filtra por categoria
  if (category && category !== 'Todas') {
    filtered = filtered.filter(product => 
      product.category === category
    );
  }
  
  return filtered;
}

/**
 * Mapeia nome da categoria para nome da pasta
 * @param {string} category - Nome da categoria
 * @returns {string} Nome da pasta correspondente
 */
function getCategoryFolderName(category) {
  if (!category) return null;
  
 
  const categoryMap = {
    'Controle de Acesso': 'acess control',
    'Video Porteiro': 'video intercom', 
    'Câmera IP': 'camera ip',
    'NVR': 'nvr',
    'DVR': 'dvr'
  };
  
 
  if (categoryMap[category]) {
    return categoryMap[category];
  }
  
  // Fallback: normaliza o nome (minúsculas, substitui espaços)
  return category.toLowerCase().replace(/\s+/g, ' ');
}

/**
 * 
 * @returns {Object} Arquivos globais compartilhados
 */
function getGlobalSharedFiles() {
  try {
    const globalFilePath = path.join(process.cwd(), 'data', 'products', 'default_global.json');
    
    if (fs.existsSync(globalFilePath)) {
      const globalData = fs.readFileSync(globalFilePath, 'utf8');
      const global = JSON.parse(globalData);
      
      if (global.files) {
        return {
          firmwares: global.files.firmwares || [],
          images: global.files.images || [],
          documents: global.files.documents || [],
          videos: global.files.videos || []
        };
      }
    }
  } catch (error) {
    console.error('Erro ao carregar arquivos globais compartilhados:', error);
  }
  
  return null;
}

/**
 * Carrega arquivos compartilhados de uma categoria
 * @param {string} category - Categoria do produto
 * @param {string} subcategory - Subcategoria do produto
 * @returns {Object} Arquivos compartilhados da categoria
 */
function getSharedCategoryFiles(category, subcategory = null) {
  if (!category) return null;
  
  try {
    const categoryFolder = getCategoryFolderName(category);
    if (!categoryFolder) return null;
    
    let categoryPath = path.join(process.cwd(), 'data', 'products', categoryFolder);
    
    // Se houver subcategoria, procura na subpasta primeiro
    if (subcategory) {
      const subcategoryPath = path.join(categoryPath, subcategory.toLowerCase());
      const subcategorySharedFile = path.join(subcategoryPath, 'default.json');
      
      if (fs.existsSync(subcategorySharedFile)) {
        const sharedData = fs.readFileSync(subcategorySharedFile, 'utf8');
        const shared = JSON.parse(sharedData);
        
        if (shared.files) {
          return {
            firmwares: shared.files.firmwares || [],
            images: shared.files.images || [],
            documents: shared.files.documents || [],
            videos: shared.files.videos || []
          };
        }
      }
    }
    
    const sharedFilePath = path.join(categoryPath, 'default.json');
    
    if (fs.existsSync(sharedFilePath)) {
      const sharedData = fs.readFileSync(sharedFilePath, 'utf8');
      const shared = JSON.parse(sharedData);
      
      if (shared.files) {
        return {
          firmwares: shared.files.firmwares || [],
          images: shared.files.images || [],
          documents: shared.files.documents || [],
          videos: shared.files.videos || []
        };
      }
    }
  } catch (error) {
    console.error(`Erro ao carregar arquivos compartilhados para categoria ${category}:`, error);
  }
  
  return null;
}

/**
 * Mescla arquivos compartilhados com arquivos específicos do produto
 * Arquivos específicos aparecem primeiro, depois os compartilhados
 * @param {Object} product 
 * @returns {Object} 
 */
export function getProductFiles(product) {
  const productFiles = product.files || {};
  
  
  const excludeShared = product.excludeSharedFiles === true || product.useSharedFiles === false;
  
  const specificFiles = {
    firmwares: productFiles.firmwares || [],
    images: productFiles.images || [],
    documents: productFiles.documents || [],
    videos: productFiles.videos || []
  };
  
  
  let mergedFiles = { ...specificFiles };
  
  // Se não deve excluir arquivos compartilhados, mescla com arquivos da categoria
  if (!excludeShared) {
    const subcategory = product.subcategory || product.type || null;
    const sharedFiles = getSharedCategoryFiles(product.category, subcategory);
    
    if (sharedFiles) {
      mergedFiles = {
        firmwares: mergedFiles.firmwares,
        images: [...mergedFiles.images, ...sharedFiles.images],
        documents: [...mergedFiles.documents, ...sharedFiles.documents],
        videos: [...mergedFiles.videos, ...sharedFiles.videos]
      };
    }
  }
  
  // Adiciona arquivos globais se o produto não tiver cloud: false
  // Produtos com cloud: false não recebem arquivos globais
  if (product.cloud !== false) {
    const globalFiles = getGlobalSharedFiles();
    
    if (globalFiles) {
      mergedFiles = {
        firmwares: mergedFiles.firmwares,
        images: [...mergedFiles.images, ...globalFiles.images],
        documents: [...mergedFiles.documents, ...globalFiles.documents],
        videos: [...mergedFiles.videos, ...globalFiles.videos]
      };
    }
  }
  
  return mergedFiles;
}

