const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const memos = [];
let nextMemoId = 1;

app.get('/api/memos', (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ success: false, error: '缺少 date 查詢參數。' });
  }

  const items = memos.filter((memo) => memo.date === date);
  res.json({ success: true, date, memos: items });
});

app.post('/api/memos', (req, res) => {
  const { date, text } = req.body;
  if (!date || !text) {
    return res.status(400).json({ success: false, error: 'date 和 text 都是必填欄位。' });
  }

  const memo = {
    id: nextMemoId++,
    date,
    text,
    createdAt: new Date().toISOString()
  };
  memos.push(memo);
  res.json({ success: true, memo });
});

app.delete('/api/memos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = memos.findIndex((memo) => memo.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: '找不到指定備忘錄。' });
  }

  const [deletedMemo] = memos.splice(index, 1);
  res.json({ success: true, memo: deletedMemo });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
