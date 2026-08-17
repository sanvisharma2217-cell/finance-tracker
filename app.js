const transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

let savingsGoal =
    Number(localStorage.getItem("savingsGoal")) || 0;
    let editTransactionId = null;


const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const transactionList = document.getElementById("transaction-list");

const filterDate = document.getElementById("filter-date");
const filterType = document.getElementById("filter-type");
const filterCategory = document.getElementById("filter-category");
const clearFilters = document.getElementById("clear-filters");

const searchInput = document.getElementById("search");

function renderTransactions() {

    transactionList.innerHTML = "";

    let filteredTransactions = [...transactions];
    const searchText = searchInput.value.toLowerCase();

if (searchText !== "") {
    filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.description.toLowerCase().includes(searchText) ||
        transaction.category.toLowerCase().includes(searchText)
    );
}

if (filterDate.value !== "") {
    filteredTransactions = filteredTransactions.filter(
        t => t.date === filterDate.value
    );
}

if (filterType.value !== "all") {
    filteredTransactions = filteredTransactions.filter(
        t => t.type === filterType.value
    );
}

if (filterCategory.value !== "all") {
    filteredTransactions = filteredTransactions.filter(
        t => t.category === filterCategory.value
    );
}

filteredTransactions.forEach(function(transaction) {

        const transactionCard = document.createElement("div");

        transactionCard.classList.add("transaction-card");

        transactionCard.innerHTML = `
    <div class="transaction-info">
        <h3>${transaction.description}</h3>
        <p>${transaction.category}</p>
    </div>

    <div class="transaction-details">

    <span class="${transaction.type}">
        ${transaction.type === "income" ? "+" : "-"}₹${transaction.amount}
    </span>

    <div class="transaction-actions">

        <button
            class="edit-btn"
            onclick="editTransaction(${transaction.id})">
              ✏️;
        </button>

        <button
            class="delete-btn"
            onclick="deleteTransaction(${transaction.id})">
            ❌
        </button>

    </div>

</div>
`;

        transactionList.appendChild(transactionCard);

    });
    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    document.getElementById("total-income").textContent = `₹${totalIncome}`;
    document.getElementById("total-expense").textContent = `₹${totalExpense}`;
    document.getElementById("balance").textContent = `₹${balance}`;
    updateSavingsGoal();
}

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = amountInput.value;
    const date = dateInput.value;
    const type = typeInput.value;
    const category = categoryInput.value;

    if (
        description === "" ||
        amount === "" ||
        date === "" ||
        type === "" ||
        category === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: Number(amount),
        type: type,
        category: category,
        date: date
    };
    window.deleteTransaction = function(id) {

    const index = transactions.findIndex(
        transaction => transaction.id === id
    );

    if (index !== -1) {
        transactions.splice(index, 1);
        localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);
    }

    renderTransactions();
    updateChart();
    updateBarChart();
    updateLineChart();
    updateMonthlyReport();
};

    transactions.push(transaction);
    localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);

    console.log(transactions);

    renderTransactions();
    updateChart();
    updateBarChart();
    updateLineChart();
    updateMonthlyReport();
    

    form.reset();

});
renderTransactions();
updateChart();
updateBarChart();
updateLineChart();
updateSavingsGoal();
updateMonthlyReport();

    const goalInput =
    document.getElementById("goal-input");

const saveGoalBtn =
    document.getElementById("save-goal");

function updateSavingsGoal() {

    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const currentSavings =
        totalIncome - totalExpense;

    document.getElementById("saved-amount").textContent =
        `₹${currentSavings}`;

    document.getElementById("goal-amount").textContent =
        `₹${savingsGoal}`;

    let percentage = 0;

    if (savingsGoal > 0) {

        percentage =
            (currentSavings / savingsGoal) * 100;

        if (percentage > 100)
            percentage = 100;

        if (percentage < 0)
            percentage = 0;
    }

    document.getElementById("progress-fill").style.width =
        percentage + "%";

    document.getElementById("progress-percent").textContent =
        percentage.toFixed(0) + "%";
}

saveGoalBtn.addEventListener("click", function () {

    const goal =
        Number(goalInput.value);

    if (goal <= 0) {

        alert("Enter a valid goal.");

        return;
    }

    savingsGoal = goal;

    localStorage.setItem(
        "savingsGoal",
        goal
    );

    updateSavingsGoal();

    goalInput.value = "";
});

clearFilters.addEventListener("click", function () {
    console.log("Clear button clicked");
    
    searchInput.value = "";
    filterDate.value = "";
    filterType.value = "all";
    filterCategory.value = "all";

    renderTransactions();

});
searchInput.addEventListener("input", function () {
    renderTransactions();
});

    function updateMonthlyReport() {

    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalSavings = totalIncome - totalExpense;

    document.getElementById("report-income").textContent =
        "₹" + totalIncome;

    document.getElementById("report-expense").textContent =
        "₹" + totalExpense;

    document.getElementById("report-savings").textContent =
        "₹" + totalSavings;

    document.getElementById("report-transactions").textContent =
        transactions.length;
}
function editTransaction(id){

    const transaction = transactions.find(t => t.id === id);

    if(!transaction) return;

    document.getElementById("description").value = transaction.description;

    document.getElementById("amount").value = transaction.amount;

    document.getElementById("date").value = transaction.date;

    document.getElementById("type").value = transaction.type;

    document.getElementById("category").value = transaction.category;

    editTransactionId = id;

}

updateMonthlyReport();
const downloadBtn = document.getElementById("download-report");

downloadBtn.addEventListener("click", function () {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalSavings = totalIncome - totalExpense;

    doc.setFontSize(20);
    doc.text("Finance Tracker Report", 20, 20);

    doc.setFontSize(14);
    doc.text("Total Income: ₹" + totalIncome, 20, 40);
    doc.text("Total Expense: ₹" + totalExpense, 20, 55);
    doc.text("Total Savings: ₹" + totalSavings, 20, 70);
    doc.text("Transactions: " + transactions.length, 20, 85);

    doc.save("Finance_Report.pdf");

});