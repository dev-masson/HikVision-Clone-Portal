const exec = require('child_process').execSync;

if (process.env.FETCH_SCRIPT) {
  try {
    console.log('🔄 Executando script de setup...');
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

