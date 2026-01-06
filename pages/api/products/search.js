// Next.js API Route - GET /api/products/search

import { searchProducts, getProductFiles, groupProductsByModel } from '../../../lib/products';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { q, category } = req.query;
    
    // Permite busca apenas por categoria ou por query + categoria
    const filteredProducts = searchProducts(q || '', category);
    
    // Agrupa produtos por modelo base
    const groupedProducts = groupProductsByModel(filteredProducts);
    
    // Contador de arquivos para cada grupo
    const productsWithCounts = groupedProducts.map(group => {
      // Se houver apenas uma variação, retorna o produto normal
      if (group.variations.length === 1) {
        const product = group.variations[0];
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
      }
      
      // Se houver múltiplas variações, retorna o grupo
      let totalFirmwares = 0;
      let totalDocuments = 0;
      let totalVideos = 0;
      
      group.variations.forEach(product => {
        const allFiles = getProductFiles(product);
        totalFirmwares += allFiles.firmwares?.length || 0;
        totalDocuments += allFiles.documents?.length || 0;
        totalVideos += allFiles.videos?.length || 0;
      });
      
      return {
        model: group.displayModel,
        baseModel: group.baseModel,
        groupName: group.groupName,
        category: group.category,
        subcategory: group.subcategory,
        thumbnail: group.thumbnail,
        hasVariations: true,
        variationsCount: group.variations.length,
        variations: group.variations.map(v => v.model),
        _fileCounts: {
          firmwares: totalFirmwares,
          documents: totalDocuments,
          videos: totalVideos,
          totalDocuments: totalDocuments + totalVideos
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

