const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Importlu you
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const adminRoutes = require('./src/routes/admin');
const healthRoutes = require('./src/routes/health');
const productRoutes = require('./src/routes/product');
const cartRoutes = require('./src/routes/cart');

// Importzhong jian jian
const errorHandler = require('./src/middleware/error');

const app = express();
const PORT = process.env.PORT || 3001;

// zhong jian jian
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// jing tai wen jian fu wu
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// APIlu you
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// 404chu li
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'jie kouDoes not exist'
  });
});

// Errorchu li zhong jian jian
app.use(errorHandler);

// qi dong fu wu qi
const startServer = async () => {
  try {
    // qi dong fu wu qi
    app.listen(PORT, () => {
      console.log(`fu wu qi yun xing zai duan kou ${PORT}`);
      console.log(`APIwen dang di zhi: http://localhost:${PORT}/api/health`);
      console.log('ti shi: ru guoDatabaseweiInitialize，qing xian yun xing "InitializeDatabase.bat"');
    });
  } catch (error) {
    console.error('fu wu qi qi dongFailed:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;