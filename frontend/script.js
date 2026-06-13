// ======================================
// FINTRACKER - PRODUCTION FINAL SCRIPT
// ======================================

const API_URL = "https://fintracker-h00i.onrender.com";

let expenseChart;
let allTransactions = [];


// ======================================
// DOM READY SAFETY WRAPPER
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    const form = document.getElementById("transactionForm");
    const filter = document.getElementById("categoryFilter");

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

    if (filter) {
        filter.addEventListener("change", filterTransactions);
    }

    loadTransactions();
}


// ======================================
// TOAST NOTIFICATION
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
// SAFE FETCH HELPER
// ======================================

async function safeFetch(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }

        return data;

    } catch (error) {
        console.error("API Error:", error);
        showToast("Server error. Try again.");
        throw error;
    }
}


// ======================================
// LOAD TRANSACTIONS
// ======================================

async function loadTransactions() {
    try {
        const transactions = await safeFetch(`${API_URL}/transactions`);

        allTransactions = transactions;

        updateSummary(transactions);
        updateChart(transactions);
        updateInsight(transactions);
        populateCategories(transactions);
        filterTransactions();

    } catch (error) {
        console.error("Load failed:", error);
    }
}


// ======================================
// FORM SUBMIT HANDLER
// ======================================

async function handleSubmit(event) {
    event.preventDefault();

    const transaction = {
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value,
        type: document.getElementById("type").value,
        date: document.getElementById("date").value,
        note: document.getElementById("note").value
    };

    try {
        await safeFetch(`${API_URL}/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transaction)
        });

        showToast("Transaction added successfully");

        document.getElementById("transactionForm").reset();

        await loadTransactions();

    } catch (error) {
        console.error("Submit failed:", error);
    }
}


// ======================================
// RENDER TRANSACTIONS
// ======================================

function renderTransactions(transactions) {
    const list = document.getElementById("transactionsList");

    if (!list) return;

    list.innerHTML = "";

    if (!transactions || transactions.length === 0) {
        list.innerHTML = "<p>No transactions found.</p>";
        return;
    }

    transactions.forEach(t => {
        const item = document.createElement("div");
        item.classList.add("transaction-item");

        const sign = t.type === "income" ? "+" : "-";

        item.innerHTML = `
            <strong>${t.category}</strong>
            <br>
            ${sign} ₹${Number(t.amount).toLocaleString()}
            <br>
            ${t.date}
        `;

        list.appendChild(item);
    });
}


// ======================================
// CATEGORY FILTER
// ======================================

function populateCategories(transactions) {
    const filter = document.getElementById("categoryFilter");
    if (!filter) return;

    const currentValue = filter.value;

    filter.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(transactions.map(t => t.category))];

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filter.appendChild(option);
    });

    filter.value = currentValue || "all";
}

function filterTransactions() {
    const filter = document.getElementById("categoryFilter");
    if (!filter) return;

    const selected = filter.value;

    let filtered = allTransactions;

    if (selected !== "all") {
        filtered = allTransactions.filter(
            t => t.category === selected
        );
    }

    renderTransactions(filtered);
}