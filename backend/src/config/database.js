const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/mall.db');

// CreateDatabaselian jie
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Databaselian jieFailed:', err.message);
  } else {
    console.log('SQLiteDatabaselian jieSucceeded');
  }
});

// zhi xingQuery
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// zhi xing dan xingQuery
const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// zhi xingUpdate/cha ru/Delete
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// guan biDatabaselian jie
const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Databaselian jie yi guan bi');
        resolve();
      }
    });
  });
};

module.exports = {
  db,
  query,
  get,
  run,
  close
};