const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());


// ======================================
// IN-MEMORY DATABASE
// ======================================

let transactions = [];


// ======================================
// HEALTH CHECK ROUTE
// ======================================

app.get("/", (req, res) => {
    res.send("FinTracker Backend is Running 🚀");
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
    try {
        console.log("Incoming request:", req.body);

        const { amount, category, type, date, note } = req.body;

        if (!amount || !category || !type || !date) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const newTransaction = {
            id: Date.now(),
            amount: Number(amount),
            category,
            type,
            date,
            note: note || ""
        };

        transactions.push(newTransaction);

        res.status(200).json({
            message: "Transaction added successfully",
            transaction: newTransaction
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});


// ======================================
// DELETE TRANSACTION (OPTIONAL)
// ======================================

app.delete("/transactions/:id", (req, res) => {
    const id = Number(req.params.id);

    transactions = transactions.filter(t => t.id !== id);

    res.json({
        message: "Transaction deleted"
    });
});


// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});