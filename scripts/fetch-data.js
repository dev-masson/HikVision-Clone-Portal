const exec = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

// Função para remover pasta recursivamente
function removeDirSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️ Removendo pasta existente: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

if (process.env.FETCH_SCRIPT) {
  try {
    console.log('🔄 Executando script de setup...');
    
    // Remove a pasta data se ela existir
    const dataPath = path.join(process.cwd(), 'data');
    removeDirSync(dataPath);
    
    exec(process.env.FETCH_SCRIPT, { stdio: 'inherit' });
    console.log('✓ Setup completado com sucesso');
  } catch (error) {
    console.error('❌ Setup falhou:', error.message);
    process.exit(1);
  }
} else {
  console.log('⚠️ Nenhum script de setup configurado (FETCH_SCRIPT não definido)');
  console.log('ℹ️ Continuando sem fetch de dados externos...');
}

