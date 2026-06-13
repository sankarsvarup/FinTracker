const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// in-memory storage
let transactions = [];
let id = 1;

// add transaction
app.post("/transactions", (req, res) => {
  const { amount, category, type, date, note } = req.body;

  const newTransaction = {
    id: id++,
    amount,
    category,
    type,
    date,
    note
  };

  transactions.push(newTransaction);

  res.json({
    message: "Transaction added",
    transaction: newTransaction
  });
});

// get all transactions
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

// health check route
app.get("/", (req, res) => {
  res.send("FinTracker Backend is Running 🚀");
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});