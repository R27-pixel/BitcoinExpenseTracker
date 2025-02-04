document.addEventListener("DOMContentLoaded", () => {
 
    const form = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-history");
    const totalExpenses = document.getElementById("total-expenses");
    const btcRateDisplay = document.getElementById("btc-rate");
    const currencySelect = document.getElementById("currency");
    const expenseTableBody = document.querySelector("#expense-table tbody");
  
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    function fetchBTCPrice() {
      const selectedCurrency = currencySelect.value || "usd";
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${selectedCurrency}`)
        .then((response) => response.json())
        .then((data) => {
          const btcPrice = data.bitcoin[selectedCurrency];
          btcRateDisplay.textContent = `Current BTC Price: ${btcPrice} ${selectedCurrency.toUpperCase()}`;
  
          const totalBTC = parseFloat(totalExpenses.textContent);
          const convertedTotal = (totalBTC * btcPrice).toFixed(2);
          document.getElementById("converted-expenses").textContent = `${convertedTotal} ${selectedCurrency.toUpperCase()}`;
        })
        .catch((error) => console.error("Error fetching BTC price:", error));
    }
  
  
    fetchBTCPrice();
    currencySelect.addEventListener("change", fetchBTCPrice);
  
    setInterval(fetchBTCPrice, 60000); 
  
  
    function renderExpenses(expensesToRender = expenses) {
      expenseList.innerHTML = "";
      let totalBTC = 0;
  
     
      expenseTableBody.innerHTML = "";
  

      const categoryTotals = {};
      expensesToRender.forEach((expense) => {
        if (!categoryTotals[expense.category]) {
          categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += parseFloat(expense.amount);
        totalBTC += parseFloat(expense.amount);
      });
  
      
      expensesToRender.forEach((expense, index) => {
        const li = document.createElement("li");
        li.textContent = `${expense.amount} BTC - ${expense.category} on ${expense.date}`;
  
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => {
          expenses.splice(index, 1);
          localStorage.setItem("expenses", JSON.stringify(expenses));
          renderExpenses();
        });
  
        li.appendChild(deleteBtn);
        expenseList.appendChild(li);
      });
  
    
      for (const [category, total] of Object.entries(categoryTotals)) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${category}</td>
          <td>${total.toFixed(4)} BTC</td>
        `;
        expenseTableBody.appendChild(row);
      }
  
      
      totalExpenses.textContent = totalBTC.toFixed(4);
    }
  
   
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const amount = parseFloat(document.getElementById("amount").value);
      const category = document.getElementById("category").value;
      const date = document.getElementById("date").value;
  
      if (!amount || !category || !date) {
        alert("Please fill in all fields.");
        return;
      }
  
      const expense = { amount, category, date };
      expenses.push(expense);
  
      localStorage.setItem("expenses", JSON.stringify(expenses));
      renderExpenses();
      form.reset();
    });
  
   
    document.getElementById("filter-btn").addEventListener("click", () => {
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;
  
      const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          (!startDate || expenseDate >= new Date(startDate)) &&
          (!endDate || expenseDate <= new Date(endDate))
        );
      });
  
      renderExpenses(filteredExpenses);
    });
  
   
    renderExpenses();
  });
  if (!localStorage.getItem('isAuthenticated')) {
    window.location.href = 'login.html';
}

function authenticateUser() {
    localStorage.setItem('isAuthenticated', true);
}

// Call this function upon successful login
authenticateUser();

  
