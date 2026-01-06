// Next.js API Route - POST /api/products/batch


import { getAllProducts, getProductFiles } from '../../../lib/products';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { models } = req.body;
    
    if (!models || !Array.isArray(models)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Campo "models" deve ser um array de strings' 
      });
    }

    const allProducts = getAllProducts();
    
    // Busca produtos que correspondem aos modelos solicitados
    const foundProducts = models
      .map(modelName => allProducts.find(p => p.model === modelName))
      .filter(product => product !== undefined);
    
    // Adiciona contador de arquivos
    const productsWithCounts = foundProducts.map(product => {
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
      products: productsWithCounts
    });
  } catch (error) {
    console.error('Erro ao buscar produtos em lote:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produtos',
      details: error.message
    });
  }
}

