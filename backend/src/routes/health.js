const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Health Checkjie kou
router.get('/', async (req, res) => {
  try {
    // jian chaDatabaselian jie
    const dbCheck = await query('SELECT 1 as test');
    
    res.status(200).json({
      success: true,
      message: 'fu wu yun xing zheng chang',
      timestamp: new Date().toISOString(),
      database: 'connected',
      services: {
        api: 'running',
        database: 'connected'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'fu wuException',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      services: {
        api: 'running',
        database: 'disconnected'
      },
      error: error.message
    });
  }
});

// DatabaseStatusjian cha
router.get('/database', async (req, res) => {
  try {
    const tables = await query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);
    
    const tableCounts = {};
    
    for (const table of tables) {
      const count = await query(`SELECT COUNT(*) as count FROM ${table.name}`);
      tableCounts[table.name] = count[0].count;
    }
    
    res.status(200).json({
      success: true,
      message: 'DatabaseStatuszheng chang',
      tables: tableCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Databasejian chaFailed',
      error: error.message
    });
  }
});

module.exports = router;