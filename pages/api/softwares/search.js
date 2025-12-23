// Next.js API Route - GET /api/softwares/search

import { searchSoftwares } from '../../../lib/softwares';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { q, category } = req.query;
    
    const filteredSoftwares = searchSoftwares(q || '', category);
    
    res.status(200).json({
      success: true,
      total: filteredSoftwares.length,
      query: q || '',
      category: category || 'Todas',
      softwares: filteredSoftwares
    });
  } catch (error) {
    console.error('Erro ao buscar softwares:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar softwares',
      details: error.message
    });
  }
}

