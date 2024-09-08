const Database = require('better-sqlite3');
const db = new Database('database.db', { verbose: console.log });

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS registration6 (
    id integer PRIMARY KEY autoincrement,
    name TEXT,
    gender TEXT,
    serialNumber TEXT,
    PlaceOfBirth TEXT,
    countryOfBirth TEXT,
    marital TEXT,
    birthdate TEXT,
    fingerPrint BLOB,
    image BLOB,
    nationality TEXT,
    status TEXT,
    regesterDate TEXT,
    relationship TEXT
  );
`);

module.exports = db;
