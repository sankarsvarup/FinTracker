// ======================================
// FINTRACKER - FINAL STABLE SCRIPT
// ======================================

const API_URL = "https://fintracker-h00i.onrender.com";

let expenseChart;
let allTransactions = [];


// ======================================
// TOAST
// ======================================

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// ======================================
// LOAD TRANSACTIONS
// ======================================

async function loadTransactions() {
    try {
        const response = await fetch(`${API_URL}/transactions`);
        const transactions = await response.json();

        console.log("Loaded transactions:", transactions);

        allTransactions = transactions || [];

        updateSummary(allTransactions);
        updateChart(allTransactions);
        updateInsight(allTransactions);
        populateCategories(allTransactions);
        filterTransactions();

    } catch (error) {
        console.error("Error loading transactions:", error);
        showToast("Failed to load data");
    }
}


// ======================================
// FORM SUBMIT
// ======================================

const form = document.getElementById("transactionForm");

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const transaction = {
            amount: document.getElementById("amount").value,
            category: document.getElementById("category").value,
            type: document.getElementById("type").value,
            date: document.getElementById("date").value,
            note: document.getElementById("note").value
        };

        try {
            const response = await fetch(`${API_URL}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transaction)
            });

            const result = await response.json();

            if (response.ok) {
                showToast(result.message || "Transaction added");
                form.reset();
                await loadTransactions();
            } else {
                showToast(result.message || "Failed to add transaction");
            }

        } catch (error) {
            console.error("Submit error:", error);
            showToast("Network error");
        }
    });
}


// ======================================
// SUMMARY DASHBOARD
// ======================================

function updateSummary(transactions) {
    let income = 0;
    let expense = 0;

    const categoryTotals = {};

    transactions.forEach(t => {
        const amount = parseFloat(t.amount) || 0;

        if (t.type === "income") {
            income += amount;
        } else {
            expense += amount;

            categoryTotals[t.category] =
                (categoryTotals[t.category] || 0) + amount;
        }
    });

    const balance = income - expense;

    let topCategory = "-";
    let highest = 0;

    for (const cat in categoryTotals) {
        if (categoryTotals[cat] > highest) {
            highest = categoryTotals[cat];
            topCategory = cat;
        }
    }

    const incomeEl = document.getElementById("totalIncome");
    const expenseEl = document.getElementById("totalExpense");
    const balanceEl = document.getElementById("netBalance");
    const topEl = document.getElementById("topCategory");

    if (incomeEl) incomeEl.textContent = `₹${income.toLocaleString()}`;
    if (expenseEl) expenseEl.textContent = `₹${expense.toLocaleString()}`;
    if (balanceEl) balanceEl.textContent = `₹${balance.toLocaleString()}`;
    if (topEl) topEl.textContent = topCategory;
}


// ======================================
// INSIGHT
// ======================================

function updateInsight(transactions) {
    const insightEl = document.getElementById("insightText");
    if (!insightEl) return;

    let income = 0;
    let expense = 0;

    const categoryTotals = {};

    transactions.forEach(t => {
        const amount = parseFloat(t.amount) || 0;

        if (t.type === "income") income += amount;
        else {
            expense += amount;
            categoryTotals[t.category] =
                (categoryTotals[t.category] || 0) + amount;
        }
    });

    let topCategory = "";
    let max = 0;

    for (const c in categoryTotals) {
        if (categoryTotals[c] > max) {
            max = categoryTotals[c];
            topCategory = c;
        }
    }

    let msg = "";

    if (transactions.length === 0) {
        msg = "Start adding transactions to see insights.";
    } else if (expense === 0) {
        msg = "No expenses yet — great job!";
    } else if (income > 0) {
        const percent = ((expense / income) * 100).toFixed(1);
        msg = `${topCategory} is your top expense category. You spent ${percent}% of income.`;
    } else {
        msg = `${topCategory} is your top expense category.`;
    }

    insightEl.textContent = msg;
}


// ======================================
// TRANSACTIONS LIST
// ======================================

function renderTransactions(transactions) {
    const list = document.getElementById("transactionsList");
    if (!list) return;

    list.innerHTML = "";

    if (!transactions.length) {
        list.innerHTML = "<p>No transactions found.</p>";
        return;
    }

    transactions.forEach(t => {
        const div = document.createElement("div");
        div.className = "transaction-item";

        const sign = t.type === "income" ? "+" : "-";

        div.innerHTML = `
            <strong>${t.category}</strong><br>
            ${sign} ₹${Number(t.amount).toLocaleString()}<br>
            ${t.date}
        `;

        list.appendChild(div);
    });
}


// ======================================
// FILTER
// ======================================

function populateCategories(transactions) {
    const filter = document.getElementById("categoryFilter");
    if (!filter) return;

    const current = filter.value;

    filter.innerHTML = '<option value="all">All Categories</option>';

    const cats = [...new Set(transactions.map(t => t.category))];

    cats.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        filter.appendChild(opt);
    });

    filter.value = current || "all";
}

function filterTransactions() {
    const filter = document.getElementById("categoryFilter");
    if (!filter) return;

    const value = filter.value;

    const filtered =
        value === "all"
            ? allTransactions
            : allTransactions.filter(t => t.category === value);

    renderTransactions(filtered);
}


// ======================================
// EVENT LISTENER
// ======================================

const filterEl = document.getElementById("categoryFilter");
if (filterEl) {
    filterEl.addEventListener("change", filterTransactions);
}


// ======================================
// INIT
// ======================================

loadTransactions();