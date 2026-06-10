# 日曆備忘錄應用

這是一個簡單的前後端專案，使用 Node.js 和 Express 作為後端，前端使用靜態 HTML/CSS/JavaScript。

## 安裝與執行

1. 開啟專案資料夾
2. 安裝相依套件

```bash
npm install
```

3. 啟動伺服器

```bash
npm start
```

4. 在瀏覽器開啟

```text
http://localhost:3000
```

## 功能

- 顯示月曆並支援上下個月份
- 點選日期後查看該日期的備忘錄
- 新增備忘錄
- 刪除備忘錄

## API

- `GET /api/memos?date=YYYY-MM-DD` 取得指定日期備忘錄
- `POST /api/memos` 新增備忘錄，JSON body: `{ date, text }`
- `DELETE /api/memos/:id` 刪除備忘錄

> 備忘錄資料目前儲存在後端記憶體中，重啟伺服器後會清除。