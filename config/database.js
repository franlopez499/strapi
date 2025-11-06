module.exports = ({ env }) => ({
    connection: {
        client: 'postgres',
        connection: {
            connectionString: env('DATABASE_URL')
        },
        debug: false,
        pool: { 
            min: 0, 
            max: 10,
            acquireTimeoutMillis: 30000,
            createTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            reapIntervalMillis: 1000,
            createRetryIntervalMillis: 200
        },
    }
});