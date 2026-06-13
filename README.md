# 💎 FinTracker

A modern personal finance dashboard that helps users track income and expenses, visualize spending patterns, and gain financial insights through an intuitive interface.

---

## 📌 Project Overview

FinTracker is a full-stack personal finance tracking application built using HTML, CSS, JavaScript, Node.js, Express.js, and SQLite.

Users can:

* Add income and expense transactions
* View all recorded transactions
* Filter transactions by category
* Track total income and expenses
* Monitor net balance
* Identify top spending categories
* Visualize spending with interactive charts
* Receive automated financial insights

---

## 🚀 Features

### Transaction Management

* Add income and expense transactions
* Record amount, category, date, and notes
* Store transaction data in SQLite database

### Dashboard Analytics

* Total Income
* Total Expense
* Net Balance
* Top Spending Category

### Data Visualization

* Interactive Doughnut Chart
* Category-wise expense breakdown

### Smart Insights

* Rule-based financial observations
* Spending-to-income analysis
* Top expense category detection

### Filtering

* Filter transactions by category
* Dynamic category generation

### User Experience

* Modern Glassmorphism UI
* Responsive Design
* Toast Notifications
* Smooth Hover Effects
* Mobile-Friendly Layout

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Chart.js

### Backend

* Node.js
* Express.js

### Database

* SQLite

---

## 📂 Project Structure

```text
FinTracker
│
├── backend
│   ├── server.js
│   ├── finance.db
│   ├── package.json
│   └── node_modules
│
├── frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd FinTracker
```

### 2. Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

Server runs on:

```text
https://fintracker-h00i.onrender.com
```

---

### 3. Frontend Setup

Open the frontend folder.

Launch the application using VS Code Live Server or any local web server.

Frontend runs on:

```text
http://127.0.0.1:5500
```

---

## 🔌 API Endpoints

### Add Transaction

```http
POST /transactions
```

Request Body:

```json
{
  "amount": 500,
  "category": "Food",
  "type": "expense",
  "date": "2026-06-12",
  "note": "Lunch"
}
```

---

### Get All Transactions

```http
GET /transactions
```

Returns all stored transactions.

---

## 📊 Financial Insight Logic

FinTracker automatically analyzes transaction data and generates observations such as:

* Highest spending category
* Expense-to-income percentage
* Spending trends based on recorded data

Example:

```text
Food is your highest spending category.
Expenses currently account for 35% of your income.
```

---

## 🎯 Assignment Requirements Covered

| Requirement            | Status |
| ---------------------- | ------ |
| Add Transaction        | ✅      |
| List Transactions      | ✅      |
| Filter Transactions    | ✅      |
| Summary View           | ✅      |
| Total Income           | ✅      |
| Total Expense          | ✅      |
| Net Balance            | ✅      |
| Top Spending Category  | ✅      |
| Spending Chart         | ✅      |
| Rule-Based Insight     | ✅      |
| Public Repository      | ✅      |
| Deployable Application | ✅      |

---

## 📸 Screenshots

Add screenshots of:

1. Dashboard Overview
2. Add Transaction Form
3. Spending Breakdown Chart
4. Financial Insight Section

---

## 🔮 Future Improvements

* Edit Transactions
* Delete Transactions
* Date Range Filters
* User Authentication
* Export Reports
* Budget Tracking
* Monthly Analytics
* Dark/Light Theme Toggle

---

## 👨‍💻 Author

**Svarup Sankar**

Built as part of a Fintech Dashboard Take-Home Assignment using modern web technologies.
