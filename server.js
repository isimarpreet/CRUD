const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// SQLite setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      age INTEGER
    )`);
  }
});

// Serve index page or redirect to /list
app.get('/', (req, res) => {
  res.redirect('/list');
});

// Serve HTML files for CRUD actions
app.get('/add', (req, res) => {
  console.log('Serving add.html'); // Debugging
  res.sendFile(path.join(__dirname, 'public', 'add.html'));
});

app.get('/edit/:id', (req, res) => {
  console.log('Serving edit.html'); // Debugging
  res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

app.get('/view/:id', (req, res) => {
  console.log('Serving view.html'); // Debugging
  res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

// Default route for /view without ID
app.get('/view', (req, res) => {
  res.send('Please provide a user ID');
});

app.get('/list', (req, res) => {
  console.log('Serving list.html'); // Debugging
  res.sendFile(path.join(__dirname, 'public', 'list.html'));
});

// API Endpoints
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ data: rows });
    }
  });
});

app.get('/api/users/:id', (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ data: row });
    }
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, phone, age } = req.body;
  db.run(`INSERT INTO users (name, email, phone, age) VALUES (?, ?, ?, ?)`, [name, email, phone, age], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'User added', id: this.lastID });
  });
});

app.put('/api/users/:id', (req, res) => {
  const { name, email, phone, age } = req.body;
  db.run(`UPDATE users SET name = ?, email = ?, phone = ?, age = ? WHERE id = ?`, [name, email, phone, age, req.params.id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'User updated' });
  });
});

app.delete('/api/users/:id', (req, res) => {
  db.run(`DELETE FROM users WHERE id = ?`, req.params.id, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'User deleted' });
  });
});

// Start server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
