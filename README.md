# WebTools API 互動指南

本指南旨在說明如何與 WebTools 專案的 API 進行互動，包括上傳和下載檔案等常見操作。

## API 基礎

- **基礎 URL：** `[請在此處填寫您的 API 基礎 URL]`
- **身份驗證：** 某些 API 端點可能需要身份驗證。請參考相關 API 文件以了解詳細資訊。

## 常見操作

### 1. 上傳檔案

您可以使用 `multipart/form-data` 格式上傳檔案。以下是一個使用 `curl` 的範例：

```bash
curl -X POST \
  '[API 基礎 URL]/api/discord/v1/upload' \
  -H 'Content-Type: multipart/form-data' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'json: {"userName": "YourUserName", "userId": "YourUserId"}' \
  -F 'file=@/path/to/your/file.txt'
```

- 將 `[API 基礎 URL]` 替換為實際的上傳端點 (例如: `http://localhost:4002`).
- 將 `YOUR_API_TOKEN` 替換為您的 API 令牌.
- 將 `YourUserName` 替換為您的使用者名稱.
- 將 `YourUserId` 替換為您的使用者ID.
- 將 `/path/to/your/file.txt` 替換為您要上傳的檔案路徑。

### 2. 下載檔案

您可以通過發送 GET 請求到下載端點來下載檔案。以下是一個使用 `curl` 的範例：

```bash
curl -X GET \
  '[API 基礎 URL]/cdn/YOUR_FILE_ID/download' \
  -o downloaded_file.txt
```

- 將 `[API 基礎 URL]` 替換為實際的 API 基礎 URL (例如: `http://localhost:4002`).
- 將 `YOUR_FILE_ID` 替換為您想要下載的檔案ID.
- `-o downloaded_file.txt` 指定下載的檔案儲存為 `downloaded_file.txt`。

### 3. 檢視檔案

您可以通過發送 GET 請求到檢視檔案端點來檢視檔案。以下是一個使用 `curl` 的範例：

```bash
curl -X GET \
  '[API 基礎 URL]/file/YOUR_FILE_ID'
```

- 將 `[API 基礎 URL]` 替換為實際的 API 基礎 URL (例如: `http://localhost:4002`).
- 將 `YOUR_FILE_ID` 替換為您想要檢視的檔案ID.

### 4. 建立新使用者

您可以通過發送 POST 請求到建立使用者端點來建立新使用者。以下是一個使用 `curl` 的範例：

```bash
curl -X POST \
  '[API 基礎 URL]/api/discord/v1/createUser' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -d '{
    "discordId": "使用者Discord ID",
    "discordName": "使用者名稱",
    "avatarLink": "使用者頭像連結"
  }'
```

- 將 `[API 基礎 URL]` 替換為實際的 API 基礎 URL (例如: `http://localhost:4002`).
- 將 `YOUR_API_TOKEN` 替換為您的 API 令牌.
- 確保提供正確的 `discordId`, `discordName`, 和 `avatarLink`.

### 5. 其他 API 操作

請參考 API 文件以獲取其他可用端點和操作的詳細資訊。

## 錯誤處理

API 將使用標準 HTTP 狀態碼來指示請求的結果。常見的狀態碼包括：

- `200 OK`: 請求成功。
- `400 Bad Request`: 請求無效。
- `401 Unauthorized`: 需要身份驗證。
- `404 Not Found`: 資源未找到。
- `500 Internal Server Error`: 伺服器發生錯誤。

## 範例程式碼

以下是一個使用 JavaScript `fetch` API 上傳檔案的範例：

```javascript
const formData = new FormData();
const fileInput = document.querySelector('input[type="file"]');
formData.append('file', fileInput.files[0]);

const headers = new Headers();
headers.append('Authorization', 'Bearer YOUR_API_TOKEN');
headers.append('json', JSON.stringify({ userName: 'YourUserName', userId: 'YourUserId' }));

fetch('[API 基礎 URL]/api/discord/v1/upload', {
  method: 'POST',
  headers: headers,
  body: formData,
})
.then(response => response.json())
.then(data => {
  console.log('上傳成功:', data);
})
.catch(error => {
  console.error('上傳失敗:', error);
});
```

## 貢獻

歡迎提交 Issue 和 Pull Request！

---

請根據您的實際 API 端點和要求修改本指南。
