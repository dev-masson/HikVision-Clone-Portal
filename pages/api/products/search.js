// Next.js API Route - GET /api/products/search

import { searchProducts, getProductFiles } from '../../../lib/products';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { q, category } = req.query;
    
    // Permite busca apenas por categoria ou por query + categoria
    const filteredProducts = searchProducts(q || '', category);
    
    // Contador de arquivos
    const productsWithCounts = filteredProducts.map(product => {
      const allFiles = getProductFiles(product);
      return {
        ...product,
        _fileCounts: {
          firmwares: allFiles.firmwares?.length || 0,
          documents: allFiles.documents?.length || 0,
          videos: allFiles.videos?.length || 0,
          totalDocuments: (allFiles.documents?.length || 0) + (allFiles.videos?.length || 0)
        }
      };
    });
    
    res.status(200).json({
      success: true,
      total: productsWithCounts.length,
      query: q || '',
      category: category || 'Todas',
      products: productsWithCounts
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produtos',
      details: error.message
    });
  }
}

