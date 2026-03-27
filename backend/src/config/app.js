// ying yong pei zhi
const config = {
  // fu wu qi pei zhi
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Databasepei zhi
  database: {
    path: process.env.DB_PATH || './database/mall.db'
  },
  
  // JWTpei zhi
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key',
    expiresIn: process.env.JWT_EXPIRE || '7d'
  },
  
  // CORSpei zhi
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  },
  
  // jia mi pei zhi
  bcrypt: {
    saltRounds: 10
  },
  
  // Paginationpei zhi
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  }
};

module.exports = config;