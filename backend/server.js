const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("database.db");

db.run(`
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL,
    category TEXT,
    type TEXT,
    date TEXT,
    note TEXT
)
`);

app.get("/", (req, res) => {
    res.send("Finance Tracker Backend Running");
});

app.use(express.json());

app.post("/transactions", (req, res) => {

    const { amount, category, type, date, note } = req.body;

    db.run(
        `
        INSERT INTO transactions
        (amount, category, type, date, note)
        VALUES (?, ?, ?, ?, ?)
        `,
        [amount, category, type, date, note],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Transaction Added",
                transactionId: this.lastID
            });

        }
    );

});

app.get("/transactions", (req, res) => {

    db.all(
        "SELECT * FROM transactions",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);

        }
    );

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});