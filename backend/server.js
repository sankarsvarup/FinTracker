const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const DATA_FILE = "transactions.json";

let transactions = [];

// ======================================
// LOAD DATA
// ======================================

if (fs.existsSync(DATA_FILE)) {
    try {
        transactions = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );
    } catch (error) {
        console.error(
            "Error reading transactions file:",
            error
        );
    }
}

// ======================================
// SAVE DATA
// ======================================

function saveTransactions() {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
            transactions,
            null,
            2
        )
    );
}

// ======================================
// ROOT ROUTE
// ======================================

app.get("/", (req, res) => {
    res.json({
        message: "FinTracker Backend Running 🚀"
    });
});

// ======================================
// GET ALL TRANSACTIONS
// ======================================

app.get("/transactions", (req, res) => {
    res.json(transactions);
});

// ======================================
// ADD TRANSACTION
// ======================================

app.post("/transactions", (req, res) => {

    const transaction = {
        id: Date.now(),
        ...req.body
    };

    transactions.push(transaction);

    saveTransactions();

    res.status(201).json({
        message: "Transaction added successfully",
        transaction
    });
});

// ======================================
// DELETE TRANSACTION
// ======================================

app.delete("/transactions/:id", (req, res) => {

    const id = Number(req.params.id);

    transactions = transactions.filter(
        transaction =>
            transaction.id !== id
    );

    saveTransactions();

    res.json({
        message: "Transaction deleted successfully"
    });
});

// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});