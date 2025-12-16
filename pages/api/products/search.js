// Next.js API Route - GET /api/products/search
// Busca produtos por modelo e categoria
import { searchProducts } from '../../../lib/products';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { q, category } = req.query;
    
    // Permite busca apenas por categoria (sem query) ou por query + categoria
    const filteredProducts = searchProducts(q || '', category);
    
    res.status(200).json({
      success: true,
      total: filteredProducts.length,
      query: q || '',
      category: category || 'Todas',
      products: filteredProducts
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

