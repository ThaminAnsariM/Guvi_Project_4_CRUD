var isEdit = false;
var editIndex = null;
var current_transactions = JSON.parse(localStorage.getItem("expenc") || "[]");

function dataSubmit() {
  var tran = document.getElementById("Tran").value;
  var typeof_tran = document.getElementById("Transaction_Type").value;
  var tran_date = document.getElementById("Transaction_Date").value;
  var Tran_disc = document.getElementById("Discreption").value;

  var current_transaction = {
    Date: tran_date,
    Transaction: typeof_tran,
    Amount: tran,
    Description: Tran_disc,
  };

  if (isEdit && editIndex !== null) {
    current_transactions[editIndex] = current_transaction;
    isEdit = false;
    editIndex = null;
  } else {
    current_transactions.push(current_transaction);
  }

  localStorage.setItem("expenc", JSON.stringify(current_transactions));
  document.querySelector("form").reset();
  display_data();
  calculateSummary();
}

function display_data() {
  var data = JSON.parse(localStorage.getItem("expenc") || "[]");
  var tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  const filterType = document.querySelector('input[name="filter"]:checked')?.id;

  if (filterType === "gained") {
    data = data.filter((txn) => txn.Transaction.toLowerCase() === "credit");
  } else if (filterType === "spends") {
    data = data.filter((txn) => txn.Transaction.toLowerCase() === "debit");
  }

  data.forEach((element, index) => {
    var tr = document.createElement("tr");

    Object.keys(element).forEach(function (key) {
      var td = document.createElement("td");
      td.innerText = element[key];
      tr.appendChild(td);
    });

    var actionTd = document.createElement("td");

    var editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className =
      "bg-yellow-400 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-500 transition duration-200";

    editBtn.onclick = function () {
      updateTransaction(index);
    };

    var deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className =
      "bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200";

    deleteBtn.onclick = function () {
      deleteTransaction(index);
    };

    actionTd.appendChild(editBtn);
    actionTd.appendChild(deleteBtn);
    tr.appendChild(actionTd);

    tbody.appendChild(tr);
  });
}

function calculateSummary() {
  const data = JSON.parse(localStorage.getItem("expenc")) || [];

  let totalIncome = 0;
  let totalSpend = 0;

  data.forEach((txn) => {
    const amount = parseFloat(txn.Amount);
    if (txn.Transaction.toLowerCase() === "credit") {
      totalIncome += amount;
    } else if (txn.Transaction.toLowerCase() === "debit") {
      totalSpend += amount;
    }
  });

  const currentBalance = totalIncome - totalSpend;

  document.getElementById("current_balance").innerText =
    currentBalance.toFixed(2);
  document.querySelectorAll(".text-green-500.text-center")[0].innerText =
    totalIncome.toFixed(2);
  document.querySelectorAll(".text-red-500.text-center")[0].innerText =
    totalSpend.toFixed(2);
}

function updateTransaction(index) {
  var transaction = current_transactions[index];

  document.getElementById("Transaction_Date").value = transaction.Date;
  document.getElementById("Transaction_Type").value = transaction.Transaction;
  document.getElementById("Tran").value = transaction.Amount;
  document.getElementById("Discreption").value = transaction.Description;

  isEdit = true;
  editIndex = index;
}

function deleteTransaction(index) {
  var isDelete = confirm("Are you sure you want to delete this transaction?");
  if (isDelete) {
    current_transactions.splice(index, 1);
    localStorage.setItem("expenc", JSON.stringify(current_transactions));
    display_data();
    calculateSummary();
  }
}

document.getElementById("all").addEventListener("change", display_data);
document.getElementById("gained").addEventListener("change", display_data);
document.getElementById("spends").addEventListener("change", display_data);

display_data();
calculateSummary();
