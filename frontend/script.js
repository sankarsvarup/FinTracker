const API_URL = "https://fintracker-h00i.onrender.com";

let allTransactions = [];
let expenseChart;


// ======================
// LOAD DATA
// ======================

async function loadTransactions() {
    try {
        const res = await fetch(`${API_URL}/transactions`);
        const data = await res.json();

        allTransactions = data;

        updateUI(data);

    } catch (err) {
        console.error("Failed to load data", err);
    }
}


// ======================
// UPDATE ALL UI
// ======================

function updateUI(data) {
    updateSummary(data);
    updateChart(data);
    updateInsight(data);
    renderTransactions(data);
    populateCategories(data);
}


// ======================
// SUMMARY
// ======================

function updateSummary(data) {

    let income = 0;
    let expense = 0;

    let monthlyExpense = 0;

    const categories = {};

    const currentMonth =
        new Date().getMonth();

    const currentYear =
        new Date().getFullYear();

    data.forEach(t => {

        const amt =
            Number(t.amount);

        const txDate =
            new Date(t.date);

        if (t.type === "income") {

            income += amt;

        } else {

            expense += amt;

            categories[t.category] =
                (categories[t.category] || 0)
                + amt;

            if (
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear
            ) {

                monthlyExpense += amt;
            }
        }
    });

    let top = "-";
    let max = 0;

    for (const category in categories) {

        if (categories[category] > max) {

            max = categories[category];
            top = category;
        }
    }

    document.getElementById(
        "totalIncome"
    ).textContent =
        `₹${income.toLocaleString()}`;

    document.getElementById(
        "totalExpense"
    ).textContent =
        `₹${expense.toLocaleString()}`;

    document.getElementById(
        "netBalance"
    ).textContent =
        `₹${(income - expense).toLocaleString()}`;

    document.getElementById(
        "topCategory"
    ).textContent =
        top;

    document.getElementById(
        "monthlyExpense"
    ).textContent =
        `₹${monthlyExpense.toLocaleString()}`;
}

// ======================
// CHART
// ======================

function updateChart(data) {
    let expenses = {};

    data.forEach(t => {
        if (t.type === "expense") {
            expenses[t.category] = (expenses[t.category] || 0) + Number(t.amount);
        }
    });

    const labels = Object.keys(expenses);
    const values = Object.values(expenses);

    const ctx = document.getElementById("expenseChart").getContext("2d");

    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: values
            }]
        }
    });
}


// ======================
// INSIGHT
// ======================

function updateInsight(data) {
    const el = document.getElementById("insightText");

    if (data.length === 0) {
        el.innerText = "No data yet";
        return;
    }

    el.innerText = "Your data is updating successfully 🚀";
}


// ======================
// LIST
// ======================

function renderTransactions(data) {
    const list = document.getElementById("transactionsList");
    list.innerHTML = "";

    data.forEach(t => {
        const div = document.createElement("div");

        div.innerHTML = `
            <b>${t.category}</b> - ${t.type} - ₹${t.amount} - ${t.date}
        `;

        list.appendChild(div);
    });
}


// ======================
// FILTER
// ======================

function populateCategories(data) {
    const filter = document.getElementById("categoryFilter");

    let cats = [...new Set(data.map(t => t.category))];

    filter.innerHTML = `<option value="all">All</option>`;

    cats.forEach(c => {
        let opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        filter.appendChild(opt);
    });
}


// ======================
// FORM SUBMIT
// ======================

document.getElementById("transactionForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value,
        type: document.getElementById("type").value,
        date: document.getElementById("date").value,
        note: document.getElementById("note").value
    };

    try {
        await fetch(`${API_URL}/transactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        loadTransactions();

    } catch (err) {
        console.error(err);
    }
});


// ======================
// FILTER EVENT
// ======================

document.getElementById("categoryFilter")
.addEventListener("change", (e) => {
    const val = e.target.value;

    if (val === "all") {
        renderTransactions(allTransactions);
    } else {
        renderTransactions(allTransactions.filter(t => t.category === val));
    }
});


// INIT
loadTransactions();