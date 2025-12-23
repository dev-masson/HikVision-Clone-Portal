// Next.js API Route - GET /api/softwares/[id]
// Retorna detalhes de um software específico por ID e seus arquivos
import { getSoftwareById, getSoftwareFiles } from '../../../lib/softwares';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'O parâmetro ID é obrigatório'
      });
    }
    
    
    const softwareId = decodeURIComponent(id);
    const software = getSoftwareById(softwareId);
    
    if (!software) {
      return res.status(404).json({
        success: false,
        error: 'Software não encontrado'
      });
    }
    
    const files = getSoftwareFiles(software);
    
    res.status(200).json({
      success: true,
      software: software,
      files: files
    });
  } catch (error) {
    console.error('Erro ao buscar software:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar software',
      details: error.message
    });
  }
}

