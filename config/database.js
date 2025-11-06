module.exports = ({ env }) => {
  // Configuración más conservadora para evitar problemas de pool
  const connectionString = env('DATABASE_URL');
  
  return {
    connection: {
      client: 'postgres',
      connection: connectionString,
      debug: false,
      pool: { 
        min: 0, 
        max: 15,
        acquireTimeoutMillis: 120000, // 2 minutos
        createTimeoutMillis: 120000,
        idleTimeoutMillis: 60000,
        reapIntervalMillis: 2000,
        createRetryIntervalMillis: 500,
        propagateCreateError: false
      },
      acquireConnectionTimeout: 120000,
    },
    settings: {
      migrations: {
        autoRun: false,
        disableForeignKeys: false
      }
    }
  };
};