const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// simple in-memory database
let transactions = [];
let id = 1;

// health check route (fixes 404 on homepage)
app.get("/", (req, res) => {
  res.send("FinTracker Backend is Running 🚀");
});

// get all transactions
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

// add transaction
app.post("/transactions", (req, res) => {
  const { amount, category, type, date, note } = req.body;

  if (!amount || !category || !type || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newTransaction = {
    id: id++,
    amount: Number(amount),
    category,
    type,
    date,
    note: note || ""
  };

  transactions.push(newTransaction);

  res.json({
    message: "Transaction added",
    transaction: newTransaction
  });
});

// delete transaction (optional but useful)
app.delete("/transactions/:id", (req, res) => {
  const { id: paramId } = req.params;

  transactions = transactions.filter(
    (t) => t.id !== parseInt(paramId)
  );

  res.json({ message: "Transaction deleted" });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});