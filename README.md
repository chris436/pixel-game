# Pixel Art Quiz Game (React + Google Apps Script)

這是一個復古像素風格的問答遊戲，使用 React 作為前端，Google Sheets + Google Apps Script (GAS) 作為後端資料庫。
玩家輸入 ID 後，系統會隨機抽取題目，並將成績紀錄回傳至 Google Sheets。

---

## 🛠️ 安裝與執行 (前端)

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```
   打開瀏覽器，前往終端機顯示的網址 (通常是 `http://localhost:5173`)。

---

## ☁️ Google Sheets 後端設置教學 (重要)

請依照以下步驟建立您的題庫與成績單：

### 1. 建立 Google Sheet
1. 前往 Google Drive，新增一個 Google Sheet。
2. 將試算表名稱改為 `Pixel Quiz Database` (或任意名稱)。

### 2.設置工作表 (Tabs)
請確保您有兩個工作表 (Tab)，名稱必須完全一致：

#### **工作表 1：`Questions` (題目)**
請在第一列 (Row 1) 填入以下標題：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **ID** | **Question** | **OptionA** | **OptionB** | **OptionC** | **OptionD** | **Answer** |

- **ID**: 題號 (唯一值，如 1, 2, 3...)
- **Question**: 題目內容
- **OptionA ~ OptionD**: 選項內容
- **Answer**: 正確答案的內容 (必須與選項文字完全一致，例如 OptionA 是 "Apple"，Answer 就要填 "Apple")

#### **工作表 2：`Responses` (成績)**
請在第一列 (Row 1) 填入以下標題：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **ID** | **PlayCount** | **TotalScore** | **MaxScore** | **FirstClearScore** | **AttemptsToClear** | **LastPlayedAt** |

### 3. 配置 Google Apps Script (GAS)
1. 在試算表中，點擊上方選單 **「擴充功能」 (Extensions) > 「Apps Script」**。
2. 將 `server/Code.gs` 檔案中的所有程式碼複製。
3. 把 Apps Script 編輯器中的預設程式碼 (`function myFunction...`) 刪除，**貼上剛剛複製的程式碼**。
4. 按下磁片圖示存檔 (Ctrl + S)，專案名稱可取為 `Pixel Quiz Backend`。

### 4. 部署為 Web App API
1. 點擊右上角藍色的 **「部署」 (Deploy) > 「新增部署作業」 (New deployment)**。
2. 點擊左側齒輪圖示，選擇 **「網頁應用程式」 (Web app)**。
3. 設定如下：
   - **說明 (Description)**: `v1` (隨意)
   - **執行身分 (Execute as)**: **`我 (Me)`** (非常重要！這樣才能讀寫您的試算表)
   - **誰可以存取 (Who has access)**: **`任何人 (Anyone)`** (非常重要！這樣前端才能呼叫 API)
4. 點擊 **「部署」 (Deploy)**。
5. 首次部署需要授權：
   -點擊「核對權限」(Review permissions)。
   -選擇您的 Google 帳號。
   -若出現「Google 尚未驗證應用程式」，點擊 **「進階」 (Advanced)** > **「前往 ... (不安全)」 (Go to ... (unsafe))**。
   -點擊 **「允許」 (Allow)**。
6. 複製彈窗中的 **「網頁應用程式網址」 (Web app URL)** (結尾通常是 `/exec`)。

### 5. 連接前端
1. 回到專案根目錄，複製 `.env.example` 為 `.env`。
2. 將剛剛複製的 URL 貼上：
   ```env
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/您的ID/exec
   ```
3. **重新啟動前端** (`Ctrl+C` 停止，再執行 `npm run dev`)。

---

## 📝 測試題庫：生成式 AI 基礎知識 (10題)

您可以直接複製下表內容貼到 `Questions` 工作表的 **A2** 儲存格開始的位置：

| ID | Question | OptionA | OptionB | OptionC | OptionD | Answer |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 下列哪一個不是著名的生成式 AI 模型？ | ChatGPT | Midjourney | Stable Diffusion | Excel | Excel |
| 2 | ChatGPT 主要基於哪種神經網路架構？ | Transformer | CNN | RNN | LSTM | Transformer |
| 3 | 在 Prompt Engineering (提示工程) 中，「Few-shot」指的是什麼？ | 給予少量範例讓 AI 學習 | 讓 AI 喝幾杯 | 只給 AI 一次機會 | 不給任何提示 | 給予少量範例讓 AI 學習 |
| 4 | 對於 AI 生成的內容產生虛構或錯誤資訊，通常稱為什麼現象？ | 夢遊 (Sleepwalking) | 幻覺 (Hallucination) | 幻想 (Fantasy) | 說謊 (Lying) | 幻覺 (Hallucination) |
| 5 | Midjourney 是一個主要用來生成什麼的 AI 工具？ | 音樂 | 影片 | 圖像 | 程式碼 | 圖像 |
| 6 | 下列哪家公司開發了 GPT 系列模型？ | Google | Meta | OpenAI | Apple | OpenAI |
| 7 | 在生成圖像時，"Seed" 通常代表什麼用途？ | 控制隨機性以重現結果 | 設定圖片尺寸 | 設定圖片解析度 | 決定 AI 的心情 | 控制隨機性以重現結果 |
| 8 | 大型語言模型 (LLM) 中的 "Token" 大致等同於什麼？ | 一個單字或字的一部分 | 一個句子 | 一個段落 | 一個像素 | 一個單字或字的一部分 |
| 9 | 哪種技術可以幫助 LLM 存取最新的外部知識庫？ | RAG (檢索增強生成) | GAN (生成對抗網路) | SSL (安全通訊協定) | NFT (非同質化代幣) | RAG (檢索增強生成) |
| 10 | 下列何者是開源 (Open Source) 的大型語言模型？ | GPT-4 | Claude 3 | Llama 3 | Gemini | Llama 3 |

---

## 🚀 自動部署到 GitHub Pages

本專案已設定 GitHub Actions，只要您將程式碼推送到 GitHub，就會自動部署到 GitHub Pages。

### 設定步驟

1. **上傳程式碼到 GitHub**
   - 建立一個新的 GitHub Repository。
   - 將本專案推送上去。

2. **設定 Secrets (環境變數)**
   - 進入您的 GitHub Repository 頁面。
   - 點選上方 **Settings** > 左側 **Secrets and variables** > **Actions**。
   - 點擊 **New repository secret**，依序新增以下變數：

| Name | Secret (Value) | 說明 |
| :--- | :--- | :--- |
| `VITE_GOOGLE_APPS_SCRIPT_URL` | `https://script.google.com/...` | 您的 GAS Web App 網址 |
| `VITE_PASS_THRESHOLD` | `60` | 通關分數門檻 (選填，預設60) |
| `VITE_QUESTION_COUNT` | `10` | 題目數量 (選填，預設10) |

3. **開啟 GitHub Pages 權限**
   - 點選上方 **Settings** > 左側 **Pages**。
   - 在 **Build and deployment** > **Source** 選擇 **GitHub Actions**。

4. **觸發部署**
   - 上述設定完成後，您可以隨意修改一個檔案並 Push，或者到 **Actions** 分頁手動觸發 `Deploy to GitHub Pages`。
   - 部署完成後，您會在 Actions 頁面看到綠色的勾勾，點進去可以看到您的遊戲網址！
