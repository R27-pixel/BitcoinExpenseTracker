document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-history");
    const totalExpenses = document.getElementById("total-expenses");
    const btcRateDisplay = document.createElement("p");
    btcRateDisplay.id = "btc-rate";
    document.querySelector("#summary").prepend(btcRateDisplay);
  
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  
    // Fetch and display BTC to fiat conversion rate
    function fetchBTCPrice() {
      const selectedCurrency = document.getElementById("currency")?.value || "usd";
  
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${selectedCurrency}`)
        .then(response => response.json())
        .then(data => {
          const btcPrice = data.bitcoin[selectedCurrency];
          btcRateDisplay.textContent = `Current BTC Price: ${btcPrice} ${selectedCurrency.toUpperCase()}`;
          
          const totalBTC = parseFloat(totalExpenses.textContent);
          const convertedTotal = (totalBTC * btcPrice).toFixed(2);
          document.getElementById("converted-expenses").textContent = `${convertedTotal} ${selectedCurrency.toUpperCase()}`;
        })
        .catch(error => {
          console.error("Error fetching BTC price:", error);
        });
    }
  
    fetchBTCPrice();
    setInterval(fetchBTCPrice, 60000); // Update every 60 seconds
  
    // Render expenses and charts
    function renderExpenses() {
      expenseList.innerHTML = "";
      let totalBTC = 0;
  
      expenses.forEach((expense, index) => {
        const li = document.createElement("li");
        li.textContent = `${expense.amount} BTC - ${expense.category} on ${expense.date}`;
        
        // Create delete button
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
        totalBTC += parseFloat(expense.amount);
      });
  
      totalExpenses.textContent = totalBTC.toFixed(4);
      plotExpenseChart(expenses);
    }
  
    function renderFilteredExpenses(filteredExpenses) {
      expenseList.innerHTML = "";
      let totalBTC = 0;
  
      filteredExpenses.forEach(expense => {
        const li = document.createElement("li");
        li.textContent = `${expense.amount} BTC - ${expense.category} on ${expense.date}`;
        expenseList.appendChild(li);
        totalBTC += parseFloat(expense.amount);
      });
  
      totalExpenses.textContent = totalBTC.toFixed(4);
      plotExpenseChart(filteredExpenses);
    }
  
    function plotExpenseChart(expenses) {
      const ctx = document.getElementById("expenseChart").getContext("2d");
      const categories = expenses.map(exp => exp.category);
      const amounts = expenses.map(exp => parseFloat(exp.amount));
  
      if (window.expenseChart) window.expenseChart.destroy(); // Prevent multiple charts
  
      window.expenseChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: categories,
          datasets: [{
            label: "BTC Spent per Category",
            data: amounts,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
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
  
    // Handle form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const amount = parseFloat(document.getElementById("amount").value);
      const category = document.getElementById("category").value;
      const date = document.getElementById("date").value;
  
      const expense = { amount, category, date };
      expenses.push(expense);
  
      localStorage.setItem("expenses", JSON.stringify(expenses));
      renderExpenses();
      form.reset();
    });
  
    // Handle filtering
    document.getElementById("filter-btn").addEventListener("click", () => {
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;
  
      const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return (!startDate || expenseDate >= new Date(startDate)) &&
               (!endDate || expenseDate <= new Date(endDate));
      });
  
      renderFilteredExpenses(filteredExpenses);
    });
  
    renderExpenses();
  });
  