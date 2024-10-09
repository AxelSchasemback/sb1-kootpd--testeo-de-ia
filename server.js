const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

const db = new sqlite3.Database('./karaoke.db', (err) => {
  if (err) {
    console.error('Error opening database', err)
  } else {
    console.log('Connected to the SQLite database.')
    db.run(`CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      score INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)
  }
})

app.post('/api/scores', (req, res) => {
  const { userId, score } = req.body
  db.run('INSERT INTO scores (userId, score) VALUES (?, ?)', [userId, score], function(err) {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ id: this.lastID })
  })
})

app.get('/api/scores/top', (req, res) => {
  db.all('SELECT * FROM scores ORDER BY score DESC LIMIT 10', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json(rows)
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})