# 日曆備忘錄應用

這是一個純前端靜態專案，所有備忘錄資料都儲存在瀏覽器的 `localStorage` 中。只要打開 `index.html` 或將此專案部署到靜態網站服務，就能正常運作。

## 安裝與執行

1. 開啟專案資料夾
2. 安裝相依套件

```bash
npm install
```

3. 啟動本機靜態伺服器

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

## 部署建議

這個專案已改成純前端靜態網站，最適合直接部署到以下平台：

- Vercel
- GitHub Pages

### Vercel 部署

1. 登入 Vercel
2. 新增專案並連接 GitHub 倉庫：`https://github.com/111210511/text`
3. 選擇分支：`main`
4. Build Command：留空
5. Output Directory：留空

### GitHub Pages 部署

1. 將此專案推送到 GitHub
2. 在倉庫設定中啟用 GitHub Pages，來源選擇 `main` 分支的根目錄

> 這個版本不再使用 Express 或 SQLite，改成可直接靜態部署的方式。