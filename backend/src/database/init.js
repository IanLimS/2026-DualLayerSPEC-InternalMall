const fs = require('fs');
const path = require('path');
const { db } = require('../config/database');

// que baoDatabasemu lu cun zai
const ensureDatabaseDir = () => {
  const dbDir = path.join(__dirname, '../../database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
};

// CreateDatabasebiao
const createTables = async () => {
  return new Promise((resolve, reject) => {
    // Userbiao
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        points INTEGER DEFAULT 0,
        role TEXT DEFAULT 'user',
        department TEXT,
        position TEXT,
        avatar TEXT,
        status TEXT DEFAULT 'active',
        last_login_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME
      )
    `, (err) => {
      if (err) {
        console.error('CreateUserbiaoFailed:', err);
        return reject(err);
      }
      
      // ProductCategorybiao
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          sort INTEGER DEFAULT 0,
          icon TEXT,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          deleted_at DATETIME
        )
      `, (err) => {
        if (err) {
          console.error('CreateProductCategorybiaoFailed:', err);
          return reject(err);
        }
        
        // Productbiao
        db.run(`
          CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            specifications TEXT,
            price REAL NOT NULL,
            points_required INTEGER NOT NULL,
            stock INTEGER DEFAULT 0,
            warning_stock INTEGER DEFAULT 10,
            images TEXT,
            status TEXT DEFAULT 'active',
            category_id INTEGER,
            sales INTEGER DEFAULT 0,
            views INTEGER DEFAULT 0,
            favorites INTEGER DEFAULT 0,
            exchange_rules TEXT,
            sort INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted_at DATETIME,
            FOREIGN KEY (category_id) REFERENCES categories (id)
          )
        `, (err) => {
          if (err) {
            console.error('CreateProductbiaoFailed:', err);
            return reject(err);
          }
          
          // Shipping Addressbiao
          db.run(`
            CREATE TABLE IF NOT EXISTS addresses (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              recipient_name TEXT NOT NULL,
              phone TEXT NOT NULL,
              province TEXT NOT NULL,
              city TEXT NOT NULL,
              district TEXT NOT NULL,
              address TEXT NOT NULL,
              is_default INTEGER DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              deleted_at DATETIME,
              FOREIGN KEY (user_id) REFERENCES users (id)
            )
          `, (err) => {
            if (err) {
              console.error('CreateShipping AddressbiaoFailed:', err);
              return reject(err);
            }
            
            // Cartbiao
            db.run(`
              CREATE TABLE IF NOT EXISTS cart (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                is_selected INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (product_id) REFERENCES products (id),
                UNIQUE(user_id, product_id)
              )
            `, (err) => {
              if (err) {
                console.error('CreateCartbiaoFailed:', err);
                return reject(err);
              }
              
              // Orderbiao
              db.run(`
                CREATE TABLE IF NOT EXISTS orders (
                  id TEXT PRIMARY KEY,
                  user_id INTEGER NOT NULL,
                  total_points INTEGER NOT NULL,
                  status TEXT DEFAULT 'pending',
                  shipping_address TEXT NOT NULL,
                  remark TEXT,
                  cancelled_at DATETIME,
                  completed_at DATETIME,
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  deleted_at DATETIME,
                  FOREIGN KEY (user_id) REFERENCES users (id)
                )
              `, (err) => {
                if (err) {
                  console.error('CreateOrderbiaoFailed:', err);
                  return reject(err);
                }
                
                // Orderming xi biao
                db.run(`
                  CREATE TABLE IF NOT EXISTS order_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id TEXT NOT NULL,
                    product_id INTEGER NOT NULL,
                    product_name TEXT NOT NULL,
                    product_image TEXT,
                    quantity INTEGER NOT NULL,
                    points_required INTEGER NOT NULL,
                    total_points INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (order_id) REFERENCES orders (id),
                    FOREIGN KEY (product_id) REFERENCES products (id)
                  )
                `, (err) => {
                  if (err) {
                    console.error('CreateOrderming xi biaoFailed:', err);
                    return reject(err);
                  }
                  
                  // Pointsji lu biao
                  db.run(`
                    CREATE TABLE IF NOT EXISTS points_history (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      user_id INTEGER NOT NULL,
                      points_change INTEGER NOT NULL,
                      type TEXT NOT NULL,
                      description TEXT,
                      reference_id TEXT,
                      reference_type TEXT,
                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (user_id) REFERENCES users (id)
                    )
                  `, (err) => {
                    if (err) {
                      console.error('CreatePointsji lu biaoFailed:', err);
                      return reject(err);
                    }
                    
                    // ProductFavoritesbiao
                    db.run(`
                      CREATE TABLE IF NOT EXISTS favorites (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        product_id INTEGER NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users (id),
                        FOREIGN KEY (product_id) REFERENCES products (id),
                        UNIQUE(user_id, product_id)
                      )
                    `, (err) => {
                      if (err) {
                        console.error('CreateProductFavoritesbiaoFailed:', err);
                        return reject(err);
                      }
                      
                      // Systempei zhi biao
                      db.run(`
                        CREATE TABLE IF NOT EXISTS system_configs (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          key TEXT UNIQUE NOT NULL,
                          value TEXT,
                          description TEXT,
                          type TEXT DEFAULT 'string',
                          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                      `, (err) => {
                        if (err) {
                          console.error('CreateSystempei zhi biaoFailed:', err);
                          return reject(err);
                        }
                        
                        // Userqian dao biao
                        db.run(`
                          CREATE TABLE IF NOT EXISTS checkins (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            user_id INTEGER NOT NULL,
                            checkin_date DATE NOT NULL,
                            points_earned INTEGER NOT NULL DEFAULT 10,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users (id),
                            UNIQUE(user_id, checkin_date)
                          )
                        `, (err) => {
                          if (err) {
                            console.error('CreateUserqian dao biaoFailed:', err);
                            return reject(err);
                          }
                          
                          console.log('DatabasebiaoCreateSucceeded');
                          resolve();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

// cha ru chu shi shu ju
const insertInitialData = async () => {
  return new Promise((resolve, reject) => {
    const bcrypt = require('bcryptjs');
    
    // cha ruTestUser
    const users = [
      { username: 'user1', password: 'password1', role: 'user', points: 100, email: 'user1@example.com', department: 'ji shu bu', position: 'ruan jian gong cheng shi' },
      { username: 'user2', password: 'password2', role: 'user', points: 200, email: 'user2@example.com', department: 'shi chang bu', position: 'shi chang zhuan yuan' },
      { username: 'user3', password: 'password3', role: 'user', points: 150, email: 'user3@example.com', department: 'ren shi bu', position: 'ren shi zhuan yuan' },
      { username: 'admin', password: 'admin123', role: 'admin', points: 0, email: 'admin@example.com', department: 'ITbu', position: 'SystemAdmin' }
    ];
    
    let userInsertCount = 0;
    
    users.forEach((user, index) => {
      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
          console.error('Passwordjia miFailed:', err);
          return reject(err);
        }
        
        db.run(`
          INSERT OR IGNORE INTO users (username, password, role, points, email, department, position) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [user.username, hash, user.role, user.points, user.email, user.department, user.position], (err) => {
          if (err) {
            console.error('cha ruUserFailed:', err);
            return reject(err);
          }
          
          userInsertCount++;
          if (userInsertCount === users.length) {
            console.log('chu shiUsershu ju cha ruSucceeded');
            
            // cha ruProductCategory
            const categories = [
              { name: 'Electronics', description: 'ge lei dian zi she bei', sort: 1 },
              { name: 'Daily Essentials', description: 'ri changDaily Essentials', sort: 2 },
              { name: 'Office Supplies', description: 'ban gong xiang guan yong pin', sort: 3 },
              { name: 'Sports & Health', description: 'Sports & Healthxiang guan chan pin', sort: 4 },
              { name: 'Books & Media', description: 'tu shu he yin xiang zhi pin', sort: 5 }
            ];
            
            let categoryInsertCount = 0;
            
            categories.forEach((category) => {
              db.run(`
                INSERT OR IGNORE INTO categories (name, description, sort) 
                VALUES (?, ?, ?)
              `, [category.name, category.description, category.sort], (err) => {
                if (err) {
                  console.error('cha ruCategoryFailed:', err);
                  return reject(err);
                }
                
                categoryInsertCount++;
                if (categoryInsertCount === categories.length) {
                  console.log('chu shiCategoryshu ju cha ruSucceeded');
                  
                  // cha ruProductshu ju
                  const products = [
                    {
                      name: 'Smartphone',
                      description: 'High-performance Smartphone，yong you you xiu de pai zhao gong neng he zhang xu hang',
                      price: 1999.00,
                      pointsRequired: 100,
                      stock: 50,
                      categoryId: 1,
                      specifications: '{"screen": "6.5ying cun", "cpu": "ba he chu li qi", "ram": "8GB", "storage": "128GB", "camera": "4800wan xiang su"}',
                      exchangeRules: 'mei ren xian dui1tai'
                    },
                    {
                      name: 'Bluetooth Earbuds',
                      description: 'wu xianBluetooth Earbuds，yin zhi qing xi，pei dai shu shi',
                      price: 299.00,
                      pointsRequired: 30,
                      stock: 100,
                      categoryId: 1,
                      specifications: '{"battery": "24xiao shi xu hang", "connection": "lan ya5.0", "waterproof": "IPX5fang shui"}',
                      exchangeRules: 'mei ren xian dui2ge'
                    },
                    {
                      name: 'Insulated Bottle',
                      description: '304bu xiu gangInsulated Bottle，bao leng bao wen xiao guo jia',
                      price: 99.00,
                      pointsRequired: 10,
                      stock: 200,
                      categoryId: 2,
                      specifications: '{"capacity": "500ml", "material": "304bu xiu gang", "temperature": "bao wen12xiao shi，bao leng24xiao shi"}',
                      exchangeRules: 'bu xian shu liang'
                    },
                    {
                      name: 'Notebook',
                      description: 'High-quality Office Notebook，shu xie liu chang',
                      price: 19.90,
                      pointsRequired: 5,
                      stock: 500,
                      categoryId: 3,
                      specifications: '{"pages": 100, "size": "A5", "type": "xian quan zhuang ding"}',
                      exchangeRules: 'bu xian shu liang'
                    },
                    {
                      name: 'Yoga Mat',
                      description: 'fang huaYoga Mat，shu shi huan bao',
                      price: 129.00,
                      pointsRequired: 25,
                      stock: 80,
                      categoryId: 4,
                      specifications: '{"thickness": "6mm", "material": "TPEhuan bao cai liao", "size": "183cm x 61cm"}',
                      exchangeRules: 'mei ren xian dui1ge'
                    },
                    {
                      name: 'Programming Book',
                      description: 'JavaScriptgao ji cheng xu she ji，Frontendkai fa bi du',
                      price: 89.00,
                      pointsRequired: 15,
                      stock: 30,
                      categoryId: 5,
                      specifications: '{"pages": 720, "author": "Nicholas C. Zakas", "publisher": "ren min you dian chu ban she"}',
                      exchangeRules: 'mei ren xian dui1ben'
                    }
                  ];
                  
                  let productInsertCount = 0;
                  
                  products.forEach((product) => {
                    db.run(`
                      INSERT OR IGNORE INTO products (
                        name, description, price, points_required, stock, category_id, 
                        specifications, exchange_rules, images
                      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                      product.name, 
                      product.description, 
                      product.price, 
                      product.pointsRequired, 
                      product.stock, 
                      product.categoryId,
                      product.specifications,
                      product.exchangeRules,
                      '[]'
                    ], (err) => {
                      if (err) {
                        console.error('cha ruProductFailed:', err);
                        return reject(err);
                      }
                      
                      productInsertCount++;
                      if (productInsertCount === products.length) {
                        console.log('chu shiProductshu ju cha ruSucceeded');
                        
                        // cha ruSystempei zhi
                        const configs = [
                          { key: 'system.name', value: 'Internal Employee Benefits Mall', description: 'Systemming cheng', type: 'string' },
                          { key: 'system.logo', value: '', description: 'SystemLogo', type: 'string' },
                          { key: 'points.daily_checkin', value: '10', description: 'mei ri qian daoPoints', type: 'number' },
                          { key: 'points.new_user', value: '100', description: 'xinUserzhu cePoints', type: 'number' },
                          { key: 'announcement.enabled', value: 'false', description: 'shi fouEnablegong gao', type: 'boolean' },
                          { key: 'announcement.title', value: '', description: 'gong gao biao ti', type: 'string' },
                          { key: 'announcement.content', value: '', description: 'gong gao nei rong', type: 'string' }
                        ];
                        
                        let configInsertCount = 0;
                        
                        configs.forEach((config) => {
                          db.run(`
                            INSERT OR IGNORE INTO system_configs (key, value, description, type) 
                            VALUES (?, ?, ?, ?)
                          `, [config.key, config.value, config.description, config.type], (err) => {
                            if (err) {
                              console.error('cha ruSystempei zhiFailed:', err);
                              return reject(err);
                            }
                            
                            configInsertCount++;
                            if (configInsertCount === configs.length) {
                              console.log('chu shiSystempei zhi shu ju cha ruSucceeded');
                              resolve();
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            });
          }
        });
      });
    });
  });
};

// InitializeDatabase
const initDatabase = async () => {
  try {
    // que baoDatabasemu lu cun zai
    ensureDatabaseDir();
    
    // Createbiao
    await createTables();
    
    // cha ru chu shi shu ju
    await insertInitialData();
    
    console.log('DatabaseInitializewan cheng');
  } catch (error) {
    console.error('DatabaseInitializeFailed:', error);
    throw error;
  }
};

module.exports = {
  initDatabase
};