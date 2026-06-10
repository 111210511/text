const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database(path.join(__dirname, 'memos.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      text TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
});

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

app.get('/api/memos', async (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ success: false, error: '缺少 date 查詢參數。' });
  }

  try {
    const items = await allAsync(
      'SELECT id, date, text, createdAt FROM memos WHERE date = ? ORDER BY createdAt DESC',
      [date]
    );
    res.json({ success: true, date, memos: items });
  } catch (error) {
    res.status(500).json({ success: false, error: '讀取資料庫失敗。' });
  }
});

app.post('/api/memos', async (req, res) => {
  const { date, text } = req.body;
  if (!date || !text) {
    return res.status(400).json({ success: false, error: 'date 和 text 都是必填欄位。' });
  }

  const createdAt = new Date().toISOString();

  try {
    const result = await runAsync(
      'INSERT INTO memos (date, text, createdAt) VALUES (?, ?, ?)',
      [date, text, createdAt]
    );
    const memo = { id: result.lastID, date, text, createdAt };
    res.json({ success: true, memo });
  } catch (error) {
    res.status(500).json({ success: false, error: '寫入資料庫失敗。' });
  }
});

app.delete('/api/memos/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, error: '無效的備忘錄 ID。' });
  }

  try {
    const result = await runAsync('DELETE FROM memos WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: '找不到指定備忘錄。' });
    }
    res.json({ success: true, memoId: id });
  } catch (error) {
    res.status(500).json({ success: false, error: '刪除資料庫資料失敗。' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
