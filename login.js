document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form");
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const authMessage = document.getElementById("auth-message");
  
    // Check if users exist in localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Signup Functionality
    signupBtn.addEventListener("click", () => {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      if (!username || !password) {
        authMessage.textContent = "Please fill in all fields.";
        return;
      }
  
      // Check if user already exists
      const userExists = users.some((user) => user.username === username);
      if (userExists) {
        authMessage.textContent = "Username already exists.";
        return;
      }
  
      // Add new user
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      authMessage.textContent = "Signup successful! Please login.";
    });
  
    // Login Functionality
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
  
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      // Check if user credentials are correct
      const user = users.find((user) => user.username === username && user.password === password);
      if (user) {
        authMessage.textContent = "Login successful!";
        // Redirect to the main page
        window.location.href = "index.html";
      } else {
        authMessage.textContent = "Invalid username or password.";
      }
    });
  });
  
