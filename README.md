# 2024/06

1. 調整 script 改為 start-backend-app。
2. 調整 env port 從 0001 改成 1001，否則 frontend fetch data fail。
3. courseValidation 驗證都改為 不需要 required，就能部分內容修改。
4. 調整回傳物件內容與文字。
5. update api 從 patch 改成 pat。

# 2024/05

1. 完成 modiel 設計，且學習 type 屬性可以為 \_\_id (mongoose.Schema.Types.ObjectId)。
2. 學習 joi moudle 進行 reqest 資料驗證。
3. 學習 jsonwebtoken moudle 進行 jwt 產生與驗證。
4. 學習 dayjs moudle 進行 Date 相關比較與格式化。
5. 學習 passport-jwt 進行 jwt 驗證。
6. 學習 若需要全部都要進行驗證則可以把 middlweware 寫在 app.use 內加入驗證的 middleware。
7. 完成各註冊、登入、驗證、課程新增、查詢的 routes。
8. 完成 課程刪除功能與 route。
