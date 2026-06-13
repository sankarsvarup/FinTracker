// ======================================
// FINTRACKER
// ======================================

let expenseChart;
let allTransactions = [];


// ======================================
// TOAST NOTIFICATION
// ======================================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


// ======================================
// SUMMARY DASHBOARD
// ======================================

function updateSummary(transactions) {

    let income = 0;
    let expense = 0;

    const categoryTotals = {};

    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount);

        if (transaction.type === "income") {

            income += amount;

        } else {

            expense += amount;

            categoryTotals[transaction.category] =
                (categoryTotals[transaction.category] || 0)
                + amount;
        }
    });

    const balance =
        income - expense;

    let topCategory = "-";
    let highestAmount = 0;

    for (const category in categoryTotals) {

        if (
            categoryTotals[category] >
            highestAmount
        ) {

            highestAmount =
                categoryTotals[category];

            topCategory =
                category;
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
        `₹${balance.toLocaleString()}`;

    document.getElementById(
        "topCategory"
    ).textContent =
        topCategory;
}


// ======================================
// CHART
// ======================================

function updateChart(transactions) {

    const categoryTotals = {};

    transactions.forEach(transaction => {

        if (transaction.type === "expense") {

            categoryTotals[
                transaction.category
            ] =
                (categoryTotals[
                    transaction.category
                ] || 0)
                + Number(transaction.amount);
        }
    });

    const labels =
        Object.keys(categoryTotals);

    const values =
        Object.values(categoryTotals);

    const ctx =
        document
            .getElementById("expenseChart")
            .getContext("2d");

    if (expenseChart) {

        expenseChart.destroy();
    }

    if (labels.length === 0) {

        expenseChart =
            new Chart(ctx, {

                type: "doughnut",

                data: {

                    labels: [
                        "No Expenses"
                    ],

                    datasets: [
                        {
                            data: [1],

                            backgroundColor: [
                                "#334155"
                            ]
                        }
                    ]
                },

                options: {

                    responsive: true,

                    cutout: "70%",

                    plugins: {

                        legend: {

                            position: "right",

                            labels: {

                                color:
                                    "#ffffff"
                            }
                        }
                    }
                }
            });

        return;
    }

    expenseChart =
        new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: labels,

                datasets: [
                    {

                        data: values,

                        backgroundColor: [

                            "#3B82F6",
                            "#10B981",
                            "#F59E0B",
                            "#EF4444",
                            "#8B5CF6",
                            "#06B6D4",
                            "#F97316",
                            "#22C55E"

                        ]
                    }
                ]
            },

            options: {

                responsive: true,

                cutout: "70%",

                plugins: {

                    legend: {

                        position: "right",

                        labels: {

                            color:
                                "#ffffff",

                            padding: 20
                        }
                    }
                }
            }
        });
}


// ======================================
// INSIGHT ENGINE
// ======================================

function updateInsight(transactions) {

    let income = 0;
    let expense = 0;

    const categoryTotals = {};

    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount);

        if (transaction.type === "income") {

            income += amount;

        } else {

            expense += amount;

            categoryTotals[
                transaction.category
            ] =
                (categoryTotals[
                    transaction.category
                ] || 0)
                + amount;
        }
    });

    let topCategory = "";
    let highestAmount = 0;

    for (const category in categoryTotals) {

        if (
            categoryTotals[category] >
            highestAmount
        ) {

            highestAmount =
                categoryTotals[category];

            topCategory =
                category;
        }
    }

    let insight = "";

    if (transactions.length === 0) {

        insight =
            "📊 Start by adding your first transaction.";

    } else if (expense === 0) {

        insight =
            "🎉 Great! No expenses recorded yet.";

    } else if (income > 0) {

        const percentage =
            (
                (expense / income) * 100
            ).toFixed(1);

        insight =
            `💡 ${topCategory} is your highest spending category. Expenses currently account for ${percentage}% of your income.`;

    } else {

        insight =
            `💡 ${topCategory} is your highest spending category.`;
    }

    document
        .getElementById(
            "insightText"
        )
        .textContent =
        insight;
}


// ======================================
// TRANSACTION LIST
// ======================================

function renderTransactions(
    transactions
) {

    const list =
        document.getElementById(
            "transactionsList"
        );

    list.innerHTML = "";

    if (
        transactions.length === 0
    ) {

        list.innerHTML =
            "<p>No transactions found.</p>";

        return;
    }

    transactions.forEach(
        transaction => {

            const item =
                document.createElement(
                    "div"
                );

            item.classList.add(
                "transaction-item"
            );

            const sign =
                transaction.type ===
                "income"
                    ? "+"
                    : "-";

            item.innerHTML = `
                <strong>${transaction.category}</strong>
                <br>
                ${sign} ₹${Number(transaction.amount).toLocaleString()}
                <br>
                ${transaction.date}
            `;

            list.appendChild(item);
        }
    );
}


// ======================================
// CATEGORY FILTER
// ======================================

function populateCategories(
    transactions
) {

    const filter =
        document.getElementById(
            "categoryFilter"
        );

    const currentValue =
        filter.value;

    filter.innerHTML =
        '<option value="all">All Categories</option>';

    const categories =
        [
            ...new Set(
                transactions.map(
                    t => t.category
                )
            )
        ];

    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category;

            option.textContent =
                category;

            filter.appendChild(
                option
            );
        }
    );

    filter.value =
        currentValue || "all";
}

function filterTransactions() {

    const selectedCategory =
        document.getElementById(
            "categoryFilter"
        ).value;

    let filtered =
        allTransactions;

    if (
        selectedCategory !== "all"
    ) {

        filtered =
            allTransactions.filter(
                transaction =>
                    transaction.category ===
                    selectedCategory
            );
    }

    renderTransactions(
        filtered
    );
}


// ======================================
// LOAD TRANSACTIONS
// ======================================

async function loadTransactions() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/transactions"
            );

        const transactions =
            await response.json();

        allTransactions =
            transactions;

        updateSummary(
            transactions
        );

        updateChart(
            transactions
        );

        updateInsight(
            transactions
        );

        populateCategories(
            transactions
        );

        filterTransactions();

    } catch (error) {

        console.error(
            "Error loading transactions:",
            error
        );
    }
}


// ======================================
// FORM SUBMIT
// ======================================

const form =
    document.getElementById(
        "transactionForm"
    );

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const transaction = {

            amount:
                document.getElementById(
                    "amount"
                ).value,

            category:
                document.getElementById(
                    "category"
                ).value,

            type:
                document.getElementById(
                    "type"
                ).value,

            date:
                document.getElementById(
                    "date"
                ).value,

            note:
                document.getElementById(
                    "note"
                ).value
        };

        try {

            const response =
                await fetch(
                    "http://localhost:5000/transactions",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                transaction
                            )
                    }
                );

            const result =
                await response.json();

            showToast(
                result.message
            );

            form.reset();

            await loadTransactions();

        } catch (error) {

            console.error(
                error
            );

            showToast(
                "Something went wrong."
            );
        }
    }
);


// ======================================
// FILTER EVENT
// ======================================

document
    .getElementById(
        "categoryFilter"
    )
    .addEventListener(
        "change",
        filterTransactions
    );


// ======================================
// INITIAL LOAD
// ======================================

loadTransactions();