const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001;

// Create and initialize the SQLite database
const db = new sqlite3.Database('newsdb.db');

// Create a 'news' table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
  )
`);

// API endpoint to fetch all news articles
app.get('/api/news', (req, res) => {
  db.all('SELECT * FROM news', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});