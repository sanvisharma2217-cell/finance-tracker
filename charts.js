
let expenseChart;

function updateChart() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    const expenseTransactions = transactions.filter(
        transaction => transaction.type === "expense"
    );

    const categoryTotals = {};

    expenseTransactions.forEach(transaction => {

        if (categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] += transaction.amount;
        } else {
            categoryTotals[transaction.category] = transaction.amount;
        }

    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const canvas = document.getElementById("expenseChart");

if (!canvas) return;

const ctx = canvas.getContext("2d");

    if (expenseChart) {
        expenseChart.destroy();
    }
    console.log(labels);
console.log(data);
console.log(expenseTransactions);


    expenseChart = new Chart(ctx, {
        type: "pie",

        data: {
            labels: labels,

            datasets: [{
                data: data,
                backgroundColor: [
                "#F8A5C2", // Baby Pink
                "#74B9FF", // Sky Blue
                "#55EFC4", // Mint
                "#A29BFE", // Lavender
                "#FFEAA7", // Soft Yellow
                "#FAB1A0", // Peach
                "#81ECEC"  // Aqua
            ],

            borderColor: "#ffffff",
            borderWidth: 3,
            hoverOffset: 15

            }]
        },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "top"
            }
        }
    }
});
}
let barChart;

function updateBarChart() {

     const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const ctx = document.getElementById("barChart");
    if (!ctx) return;

    if (barChart) {
        barChart.destroy();
    }

    barChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
    label: "Amount",
    data: [totalIncome, totalExpense],
    backgroundColor: [
        "#55EFC4",   // Income - Green
        "#FF7675"    // Expense - Red
    ],
    borderRadius: 8
}]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}
     const lineCtx = document.getElementById("lineChart").getContext("2d");

const lineChart = new Chart(lineCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Monthly Expense",
            data: [],
            borderColor: "#F06292",
            backgroundColor: "rgba(240,98,146,0.2)",
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true
    }
});

    function updateLineChart() {

    const monthlyData = {};

    transactions.forEach(transaction => {

        if (transaction.type === "expense") {

            const date = new Date(transaction.date);

if (isNaN(date)) return;

const month = date.toLocaleString("default", {
    month: "short"
});

            if (!monthlyData[month]) {
                monthlyData[month] = 0;
            }

            monthlyData[month] += transaction.amount;
        }

    });

    lineChart.data.labels = Object.keys(monthlyData);

    lineChart.data.datasets[0].data =
        Object.values(monthlyData);

    lineChart.update();
}