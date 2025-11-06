'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {
    console.log('[Bootstrap] Register phase iniciado');
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    console.log('[Bootstrap] Bootstrap phase iniciado');
    
    try {
      // Verificar estado del pool de conexiones
      const db = strapi.db;
      if (db && db.connection) {
        const pool = db.connection.client?.pool;
        if (pool) {
          console.log('[Bootstrap] Pool de conexiones disponible');
          console.log('[Bootstrap] Pool config:', {
            min: pool.min,
            max: pool.max,
            numUsed: pool.numUsed ? pool.numUsed() : 'N/A',
            numFree: pool.numFree ? pool.numFree() : 'N/A',
            numPendingAcquires: pool.numPendingAcquires ? pool.numPendingAcquires() : 'N/A'
          });
        } else {
          console.log('[Bootstrap] Pool no disponible aún');
        }
      }
      
      console.log('[Bootstrap] Bootstrap phase completado exitosamente');
    } catch (error) {
      console.error('[Bootstrap] Error durante bootstrap:', error.message);
      console.error('[Bootstrap] Stack:', error.stack);
      throw error;
    }
  },
};
