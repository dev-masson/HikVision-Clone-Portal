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
 * Carrega todos os produtos de todos os arquivos JSON na pasta products (recursivamente)
 * @returns {Array} Array de produtos combinados de todos os arquivos
 */
export function getAllProducts() {
  const productsDir = path.join(process.cwd(), 'data', 'products');
  const allProducts = [];
  
  try {
    // Verifica se a pasta existe
    if (!fs.existsSync(productsDir)) {
      // Fallback: tenta ler o arquivo antigo products.json
      const oldProductsPath = path.join(process.cwd(), 'data', 'products.json');
      if (fs.existsSync(oldProductsPath)) {
        const productsData = fs.readFileSync(oldProductsPath, 'utf8');
        return JSON.parse(productsData);
      }
      return [];
    }
    
    // Lê recursivamente todos os arquivos .json
    readJsonFilesRecursively(productsDir, allProducts);
    
    return allProducts;
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return [];
  }
}

/**
 * Busca produto por modelo (identificador único)
 * @param {string} model - Modelo do produto
 * @returns {Object|null} Produto encontrado ou null
 */
export function getProductByModel(model) {
  const products = getAllProducts();
  return products.find(p => p.model === model) || null;
}

/**
 * Busca produto por ID (mantido para compatibilidade, mas usa modelo se ID não existir)
 * @param {string} id - ID ou modelo do produto
 * @returns {Object|null} Produto encontrado ou null
 */
export function getProductById(id) {
  const products = getAllProducts();
  // Tenta buscar por ID primeiro, depois por modelo
  return products.find(p => p.id === id || p.model === id) || null;
}

/**
 * Busca produtos por termo de busca e/ou categoria
 * @param {string} query - Termo de busca (opcional, pode ser vazio)
 * @param {string} category - Categoria (opcional)
 * @returns {Array} Produtos filtrados
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
 * Gera arquivos mock para um produto
 * @param {Object} product - Objeto do produto
 * @returns {Object} Objeto com arrays de imagens, documentos e vídeos
 */
export function generateProductFiles(product) {
  const files = {
    images: [],
    documents: [],
    videos: []
  };
  
  // Gerar imagens
  for (let i = 1; i <= product.images; i++) {
    files.images.push({
      name: `${product.model}_imagem_${i}.jpg`,
      type: 'image',
      size: Math.floor(Math.random() * 2000000) + 500000,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      url: `#`,
      downloadUrl: `#`,
      thumbnail: product.thumbnail
    });
  }
  
  // Gerar documentos
  const documentTypes = [
    'Manual de Instalação',
    'Manual do Usuário',
    'Guia Rápido',
    'Datasheet',
    'Especificações Técnicas',
    'Certificações',
    'Firmware',
    'Diagrama de Conexões',
    'FAQ',
    'Termos de Garantia',
    'Guia de Solução de Problemas',
    'Release Notes'
  ];
  
  for (let i = 0; i < product.documents && i < documentTypes.length; i++) {
    files.documents.push({
      name: `${product.model}_${documentTypes[i].replace(/\s+/g, '_')}.pdf`,
      type: 'pdf',
      size: Math.floor(Math.random() * 5000000) + 100000,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      url: `#`,
      downloadUrl: `#`
    });
  }
  
  // Gerar vídeos
  const videoTypes = [
    'Tutorial de Instalação',
    'Configuração Inicial',
    'Demonstração de Funcionalidades',
    'Manutenção e Cuidados',
    'Integração com Sistemas'
  ];
  
  for (let i = 0; i < product.videos && i < videoTypes.length; i++) {
    files.videos.push({
      name: `${product.model}_${videoTypes[i].replace(/\s+/g, '_')}.mp4`,
      type: 'video',
      size: Math.floor(Math.random() * 50000000) + 10000000,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      url: `#`,
      downloadUrl: `#`
    });
  }
  
  return files;
}

/**
 * Obtém arquivos de um produto (apenas os definidos, sem geração automática)
 * @param {Object} product - Objeto do produto
 * @returns {Object} Arquivos do produto (apenas os definidos)
 */
export function getProductFiles(product) {
  // Se o produto tem arquivos definidos, usa eles
  if (product.files) {
    return {
      firmwares: product.files.firmwares || [],
      images: product.files.images || [],
      documents: product.files.documents || [],
      videos: product.files.videos || []
    };
  }
  
  // Se não tem arquivos definidos, retorna arrays vazios (não gera automaticamente)
  return {
    firmwares: [],
    images: [],
    documents: [],
    videos: []
  };
}

