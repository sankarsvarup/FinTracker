let transactions = [];
let id = 1;

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

app.get("/transactions", (req, res) => {
  res.json(transactions);
});