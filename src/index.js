'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    console.log('[Bootstrap] Register phase iniciado');
    
    // Monitorear creación de conexiones después de que se inicialice la DB
    strapi.db?.connection?.client?.pool?.on?.('acquireRequest', (eventId) => {
      console.log('[DB Pool] Solicitud de conexión:', eventId);
    });
    
    strapi.db?.connection?.client?.pool?.on?.('acquireSuccess', (eventId, resource) => {
      const pool = strapi.db?.connection?.client?.pool;
      console.log('[DB Pool] Conexión adquirida exitosamente. Pool usado:', pool?.numUsed?.() || 'N/A', 'Pool libre:', pool?.numFree?.() || 'N/A');
    });
    
    strapi.db?.connection?.client?.pool?.on?.('acquireFail', (eventId) => {
      console.error('[DB Pool] FALLO al adquirir conexión:', eventId);
    });
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
      // Esperar un momento para que el pool se inicialice
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar estado del pool de conexiones
      const db = strapi.db;
      if (db && db.connection) {
        const pool = db.connection.client?.pool;
        if (pool) {
          console.log('[Bootstrap] Pool de conexiones disponible');
          
          // Intentar obtener información del pool de forma segura
          try {
            const poolInfo = {
              min: pool.min || 'N/A',
              max: pool.max || 'N/A',
            };
            
            // Métodos que pueden no estar disponibles en todas las versiones
            if (typeof pool.numUsed === 'function') {
              poolInfo.numUsed = pool.numUsed();
            }
            if (typeof pool.numFree === 'function') {
              poolInfo.numFree = pool.numFree();
            }
            if (typeof pool.numPendingAcquires === 'function') {
              poolInfo.numPendingAcquires = pool.numPendingAcquires();
            }
            
            console.log('[Bootstrap] Pool config:', poolInfo);
          } catch (poolError) {
            console.log('[Bootstrap] No se pudo obtener info detallada del pool:', poolError.message);
          }
        } else {
          console.log('[Bootstrap] Pool no disponible aún');
        }
      } else {
        console.log('[Bootstrap] DB connection no disponible');
      }
      
      console.log('[Bootstrap] Bootstrap phase completado exitosamente');
    } catch (error) {
      console.error('[Bootstrap] Error durante bootstrap:', error.message);
      console.error('[Bootstrap] Stack:', error.stack);
      throw error;
    }
  },
};
