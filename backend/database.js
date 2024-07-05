const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS readings (id INTEGER PRIMARY KEY, temperature REAL, humidity REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)');
});

module.exports = db;
