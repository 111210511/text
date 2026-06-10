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

## 部署建議

本專案使用 Node.js + Express 後端，並將備忘錄儲存在 SQLite 本地資料庫 `memos.db`。最適合的部署服務是可以支援長時間運行 Node.js Web Service 的平台，例如 Render。

1. 登入 Render
2. 新增一個 Web Service
3. 連接 GitHub 倉庫：`https://github.com/111210511/text`
4. 選擇分支：`main`
5. Build Command：`npm install`
6. Start Command：`npm start`

> Vercel 目前不適合直接部署這個專案，因為 Vercel 的 serverless 環境無法穩定保存 SQLite 本地資料庫。

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