const { initDatabase } = require('./src/database/init');

console.log('Initializing database...');

initDatabase()
  .then(() => {
    console.log('Database initialization completed！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });