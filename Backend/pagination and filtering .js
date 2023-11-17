const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001;

const db = new sqlite3.Database('newsdb.db');

// ...

// API endpoint to fetch paginated and filtered news articles
app.get('/api/news', (req, res) => {
  const { page = 1, pageSize = 10, category } = req.query;
  const offset = (page - 1) * pageSize;

  let query = 'SELECT * FROM news';
  let countQuery = 'SELECT COUNT(*) as count FROM news';

  // Apply filters if specified
  if (category) {
    query += ` WHERE category = '${category}'`;
    countQuery += ` WHERE category = '${category}'`;
  }

  // Apply pagination
  query += ` LIMIT ${pageSize} OFFSET ${offset}`;

  // Fetch news articles
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Fetch total count for pagination
      db.get(countQuery, (countErr, countRow) => {
        if (countErr) {
          console.error(countErr);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const totalItems = countRow.count;
          const totalPages = Math.ceil(totalItems / pageSize);

          res.json({
            totalItems,
            totalPages,
            currentPage: parseInt(page),
            pageSize: parseInt(pageSize),
            news: rows,
          });
        }
      });
    }
  });
});

// ...