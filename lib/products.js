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
 * @param {Object} product 
 * @returns {Object} 
 */
export function getProductFiles(product) {

  if (product.files) {
    return {
      firmwares: product.files.firmwares || [],
      images: product.files.images || [],
      documents: product.files.documents || [],
      videos: product.files.videos || []
    };
  }
  
  return {
    firmwares: [],
    images: [],
    documents: [],
    videos: []
  };
}

