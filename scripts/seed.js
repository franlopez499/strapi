const strapi = require('@strapi/strapi');
const seedData = require('../database/seeders/blog-data');

async function runSeed() {
  console.log('🚀 Iniciando aplicación Strapi...');
  
  try {
    // Inicializar Strapi
    const app = await strapi().load();
    
    console.log('✅ Strapi cargado correctamente');
    console.log('🌱 Ejecutando seed de datos...');
    
    // Ejecutar el seed
    await seedData.seed(app);
    
    console.log('🎉 Seed completado exitosamente');
    
    // Cerrar la aplicación
    await app.destroy();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

runSeed(); 