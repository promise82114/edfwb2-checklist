# Side Project 共用 Google Drive 進度

## 原有架構與整合方案

網站直接提供 `dist/`，沒有伺服器、Client Secret 或編譯依賴。Checklist 的本機存檔保留 `edfwb2-progress-v1`：`app`、`schema: 1`、`catalogVersion`、數字毫秒 `updatedAt`，以及 `entries`、`favorites`、`content`、`missionNotes`。筆記以關卡代碼為 key，值為 `{text, updatedAt}`；空文字保留為刪除記錄，避免舊裝置讓已清空筆記復活。每一項記錄保留自己的更新時間，原本的跨分頁同步、快照、復原與 JSON 備份照常運作。

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

從 header 的雲端狀態按鈕或「備份與還原」開啟 Google Drive。授權服務就緒後再按連接；popup 直接由按鈕事件開啟。

- 「啟用自動同步」預設勾選。連接後先下載並依每項更新時間合併，再視差異建立或更新雲端檔案。相同時間保留本機；明確的取消勾選也參與同步。各裝置需保持正確時間，這不是伺服器時間的全域排序。
- 本機操作立即保存，停止操作 5 秒後同步；每 60 秒、恢復連線或回到頁面时重新比較。背景分頁的計時可能被瀏覽器延後。相同內容不重複上傳，關閉頁面不保證完成最後一次同步。
- Header 顯示未連接、待同步、同步中、已同步時間、離線、暫停或需重新授權。已同步時間是最後一次成功比較／同步的時間，不一定有上傳。
- 可關閉自動同步。「立即同步進度」仍會先合併，不直接拿本機覆蓋雲端。「下載雲端進度並比較」本身只讀取；要保留比較結果供手動操作，先關閉自動同步。
- 手動「合併至本機」沿用聯集已取得、收藏與啟用設定，筆記採更新時間較新者（相同時間保留本機）；「還原至本機」要求確認。手動還原保留原有復原功能。自動合併及手動套用前必須成功保留快照。自動合併保留各項原始時間，避免新時間蓋掉其他裝置的變更。
- 上傳前重查 ID／version，下載前後也比對 version；ETag 可讀時另外帶 If-Match，缺少 ETag 不再阻擋更新。每次寫入後重新下載，核對內容，若有差異再合併重試。衝突最多重試三次；仍失敗則稍後重試。版本檢查與寫入不是原子交易：缺少 ETag 時，兩裝置完全同時寫入仍可能覆蓋對方尚未讀到的變更；讀回只能驗證當下結果，不保證偵測所有競態。
- 首次建立檔案不具跨裝置的原子唯一性；若兩台同時首次建立而產生同名檔案，後續操作會停止，不任意選一份或刪除。
- 網路失敗及逾時保留本機進度，下次同步先重新下載確認，不直接重送舊資料。403、無效資料、未知項目、其他 projectId、過大的檔案與重複檔案會暫停自動同步，需排除問題後按立即同步。
- 401 或期限屆滿清除記憶體 Token，顯示重新授權。重新整理也需再次連接；程式不自動彈出授權視窗。面板顯示 Google 回傳的有效秒數、取得與到期時間，並区分自然到期與 API 提前回傳 401。重新授權使用空 prompt 減少重複選帳號，首次連接及切換帳號仍要求選擇。切換帳號清除上一帳號的比較與同步結果。
- 中斷連接清除此頁 Token 與待執行的排程，保留兩端進度；已送出的寫入請求無法保證撤回。不撤銷整個共用 Client ID 的權限；撤銷請在 Google 帳號的應用程式權限中處理。

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
    "content": {},
    "missionNotes": {}
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

另一個 Repo 提供自己的資料驗證與本機存檔 adapter，沿用 Client ID，改用獨立 projectId／JSON 檔名。`cloud-sync.js` 是本遊戲的 UI；`app.js` 的 `EDF_CHECKLIST_STORAGE` 提供 `get`、`validate`、`reconcile`、`apply`、`export`，共用模組不引用這個介面。

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

先執行 `node server.mjs`，再執行 `node verify-cloud.mjs`。可用 `TEST_URL` 指定另一個本機網址。測試攔截 GIS 與 Drive API，不連接真實帳號；涵蓋連接後自動建立／更新、5 秒合併操作、取消勾選、逐項更新時間合併、快照、版本衝突重試、斷線補存、自動開關、無變更不寫入、API 錯誤、無效資料、重複檔案、401／期限屆滿／重新授權、popup／scope 拒絕、60 秒檢查、JSON 匯出與手機 header。
