module.exports = ({ env }) => {
  const connectionString = env('DATABASE_URL');
  
  // Logging para diagnóstico
  console.log('[DB Config] Inicializando configuración de base de datos...');
  console.log('[DB Config] Connection string:', connectionString ? `${connectionString.substring(0, 20)}...` : 'NO CONFIGURADO');
  
  // Configurar logging personalizado para Knex
  const knexLogger = {
    warn: (message) => {
      console.log('[Knex WARN]', message);
    },
    error: (message) => {
      console.error('[Knex ERROR]', message);
    },
    deprecate: (message) => {
      console.warn('[Knex DEPRECATE]', message);
    },
    debug: (message) => {
      // Solo loggear queries importantes durante bootstrap
      if (message && typeof message === 'object' && message.sql) {
        console.log('[Knex Query]', message.sql.substring(0, 100) + '...');
      }
    }
  };
  
  return {
    connection: {
      client: 'postgres',
      connection: connectionString,
      debug: false,
      pool: { 
        min: 2, // Mínimo 2 para mantener conexiones activas
        max: 20,
        acquireTimeoutMillis: 600000, // 10 minutos - muy largo para bootstrap
        createTimeoutMillis: 600000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
        // Callbacks para monitorear el pool
        afterCreate: (conn, done) => {
          console.log('[DB Pool] Nueva conexión creada. Pool size:', conn.pool ? conn.pool.numUsed() : 'unknown');
          done(null, conn);
        },
        afterDestroy: (conn, err) => {
          if (err) {
            console.error('[DB Pool] Error al destruir conexión:', err.message);
          } else {
            console.log('[DB Pool] Conexión destruida');
          }
        }
      },
      acquireConnectionTimeout: 600000, // 10 minutos
      log: knexLogger,
      // Hook para monitorear adquisición de conexiones
      asyncStackTraces: true,
    },
    settings: {
      runMigrations: false, // Deshabilitar migraciones completamente
      migrations: {
        autoRun: false,
        disableForeignKeys: false
      }
    }
  };
};