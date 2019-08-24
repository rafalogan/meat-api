export const environment  = {
    server: { port: process.env.SERVER_PORT || 3003 },
    db: { url: process.env.DB_URL || 'mongodb://root:root@localhost/meat-api?authSource=admin' }
};