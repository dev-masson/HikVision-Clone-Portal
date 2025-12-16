// Next.js API Route - GET /api/products/[model]
// Retorna detalhes de um produto específico por modelo e seus arquivos
import { getProductByModel, getProductFiles } from '../../../lib/products';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { id } = req.query; // 'id' na rota, mas na verdade é o modelo
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'O parâmetro modelo é obrigatório'
      });
    }
    
    // Decodifica o modelo da URL (pode ter caracteres especiais)
    const model = decodeURIComponent(id);
    const product = getProductByModel(model);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    const files = getProductFiles(product);
    
    res.status(200).json({
      success: true,
      product: product,
      files: files
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produto',
      details: error.message
    });
  }
}

