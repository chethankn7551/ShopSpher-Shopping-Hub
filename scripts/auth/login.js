document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorBox = document.querySelector(".js-error");

  if (!form) {
    console.error("Login form not found");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!email || !password) {
      errorBox.innerText = "Please enter email and password.";
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      errorBox.innerText = "Invalid email or password.";
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "home.html";
  });
});
