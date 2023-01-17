# 會員資料表

Demo: https://justine92415.github.io/interVIewExam/

## 前端技術

-   jQuery
-   Bootstrap
-   AJAX
    以 fetch 的方式發送請求給後端，實現會員資料的增刪改查動作。

## 後端技術

-   Node.js (Express)
    以 Restful 風格撰寫 API，並將此 api 布署至 fly.io
    `GET` /api/members 獲取所有會員資料/搜尋某會員資料
    `POST` /api/members 新增會員資料
    `GET` /api/members/:id 獲取會員資料
    `PATCH` /api/members/:id 更新會員資料
    `DELETE` /api/members/:id 刪除會員資料
-   mongoDB (Mongoose)
    根據前端發送過來的請求，對資料庫做增刪改查的動作
