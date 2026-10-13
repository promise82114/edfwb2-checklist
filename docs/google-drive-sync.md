# Side Project 共用 Google Drive 進度

## 原有架構與整合方案

網站直接提供 `dist/`，沒有伺服器、Client Secret 或編譯依賴。Checklist 的本機存檔保留 `edfwb2-progress-v1`：`app`、`schema: 1`、`catalogVersion`、數字毫秒 `updatedAt`，以及 `entries`、`favorites`、`content`。每一項記錄保留自己的更新時間，原本的跨分頁同步、快照、復原與 JSON 備份照常運作。

這次依序新增共用 OAuth、Drive 檔案存取、版本化 JSON 包裝，再透過一個小型 Checklist adapter 接上比較面板。沒有重寫清單或改變項目 ID。

## Google Cloud 設定

1. 在這個共用 Client ID 所屬的 Google Cloud 專案啟用 Google Drive API。
2. Google Auth Platform 的 Web application OAuth client 使用 `dist/cloud-config.js` 中的公開 Client ID。
3. Authorized JavaScript origins 加入 `https://promise82114.github.io`。填來源，不含 `/edfwb2-checklist/` 路徑。同一個 GitHub Pages 網域下的其他 Side Project 可沿用這個來源。
4. 本機開發建議加入 `http://localhost`、`http://localhost:4174`、`http://localhost:4175`。若使用本專案預覽的 `127.0.0.1`，也加入 `http://127.0.0.1`、`http://127.0.0.1:4174`、`http://127.0.0.1:4175`。
5. Consent screen 加入 `https://www.googleapis.com/auth/drive.appdata`。若應用程式仍處於 Testing，將實際測試帳號加入 Test users。
6. Token Flow 使用 popup；本實作沒有 OAuth redirect endpoint，也不使用 Client Secret。不同網域的 Side Project 需另外加入其 JavaScript origin。

Client ID 是公開設定，並不是 Access Token。Token 僅保存在 `GoogleAuth` instance 的 private field；不寫入 localStorage、sessionStorage、備份、URL 或 Repo。重新整理頁面需再次按連接。離線仍可使用本機 Checklist 與 JSON 備份，但不能授權或呼叫 Drive。

Google Cloud API 啟用、允許來源與測試使用者清單不在 Repo 內，必須在 Google Cloud Console 確認。本次自動驗證使用模擬服務，未操作真實帳號或 Drive 資料。

官方參考：[Token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model)、[Client ID 與來源設定](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)、[appDataFolder](https://developers.google.com/workspace/drive/api/guides/appdata)、[上傳檔案](https://developers.google.com/workspace/drive/api/guides/manage-uploads)。

## 使用方式與衝突處理

從「備份與還原」開啟「連接 Google Drive」。授權服務就緒後再按連接；popup 直接由按鈕事件開啟。

- 連接成功僅下載比較，不寫入任一端。即使本機／雲端都已有進度，也必須明確選擇。
- 無雲端檔案時，可手動上傳本機；有檔案時，上傳會先要求確認覆蓋。
- 「下載雲端進度並比較」只讀取；「合併至本機」聯集已取得、收藏與啟用設定；「還原至本機」要求確認後套用雲端資料。
- 還原／合併前必須成功保留本機快照，並沿用 Checklist 的復原功能。套用至本機後仍須手動上傳，雲端才會更新。
- 上傳前重查檔案 ID／version；下載前後也比對 version。若能取得 ETag，更新時另外帶 `If-Match`。版本不同就停止，必須重新下載比較。
- Drive 未提供可讀 ETag 時，version 重查仍存在檢查與寫入之間的競態，不能保證跨裝置同時寫入完全原子。請避免兩個裝置同時上傳；這不是即時同步服務。
- 寫入 API 失敗或逾時，不自動重試或繼續覆蓋，必須重新下載確認狀態；網路中断時，伺服器可能已完成先前寫入。
- 401 或期限屆滿清除記憶體 Token，顯示重新授權。使用者按鈕再授權後重新查檔案，不保留上一個帳號的 file ID／比較結果。
- 中斷連接只清除此頁 Token，保留兩端進度，不撤銷整個共用 Client ID 的權限。若要撤銷，可在 Google 帳號的應用程式權限中處理。
- 同名檔案超過一份時停止操作；不任意選一份或刪除。雲端格式不正確、其他 projectId、未知項目、過大的檔案或任何 API 讀取錯誤，都不修改本機。

## JSON 格式與檔案隔離

檔名 `edfwb2-checklist.json`，存於 `appDataFolder`，不在一般「我的雲端硬碟」清單顯示。

```json
{
  "schemaVersion": 1,
  "updatedAt": "2026-10-13T00:00:00.000Z",
  "projectId": "edfwb2-checklist",
  "data": {
    "app": "edfwb2-collection",
    "schema": 1,
    "catalogVersion": "2026-10-10",
    "updatedAt": 1791849600000,
    "entries": {},
    "favorites": {},
    "content": {}
  }
}
```

外層 `updatedAt` 使用進度本身的更新時間，不代表上傳時間；本機舊格式仍可匯出與匯入。雲端面板的 JSON 匯出包含外層包裝，也可用原有「備份與還原」匯入。檔名与 `projectId` 雙重隔離每個遊戲。

## 在其他 Repository 重用

複製 `dist/shared/` 的三個檔案：

|模組|職責|
|---|---|
|`google-auth.js`|載入 GIS、popup 授權、scope 檢查、記憶體 Token 與期限|
|`drive-appdata.js`|Drive 查詢、下載、建立、更新、版本檢查與錯誤|
|`progress-envelope.js`|`projectId`、外層版本與更新時間包裝／檢查|

另一個 Repo 提供自己的資料驗證與本機存檔 adapter，沿用 Client ID，改用獨立 projectId／JSON 檔名。`cloud-sync.js` 是本遊戲的 UI；`app.js` 的 `EDF_CHECKLIST_STORAGE` 提供 `get`、`validate`、`apply`、`export`，共用模組不引用這個介面。

```js
const auth = new SideProjectAuth.GoogleAuth(sharedClientId);
await auth.prepare(); // 預先載入，不要在 popup 按鈕前等待網路。
const drive = new SideProjectDrive.DriveAppData(auth, 'another-game.json');
connectButton.onclick = async () => {
  await auth.connect(); // 使用者直接按鈕事件觸發。
  const remote = await drive.read();
  // 驗證並顯示比較，由使用者選擇後才套用／寫入。
};
```

## 驗證

先執行 `node server.mjs`，再執行 `node verify-cloud.mjs`。也可用 `TEST_URL` 指定已啟動的另一個本機網址。測試攔截 GIS 與 Drive API，不連接真實 Google 帳號；涵蓋新檔建立／更新、首次連接不覆蓋、明確選擇、版本衝突、合併／還原／取消／復原、跨專案格式拒絕、重複檔案、API 錯誤、401／期限屆滿／重新授權、popup／scope 拒絕與手機版面。既有 DLC、關卡與收藏測試也須通過。
