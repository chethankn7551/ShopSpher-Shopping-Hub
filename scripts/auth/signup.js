document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const errorBox = document.querySelector(".js-error");

  if (!form) {
    console.error("Signup form not found");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!name || !email || !phone || !password) {
      errorBox.innerText = "All fields are required.";
      return;
    }

    if (!email.includes("@")) {
      errorBox.innerText = "Please enter a valid email.";
      return;
    }

    if (password.length < 4) {
      errorBox.innerText = "Password must be at least 4 characters.";
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const alreadyExists = users.some((u) => u.email === email);
    if (alreadyExists) {
      errorBox.innerText = "Account already exists with this email.";
      return;
    }

    const newUser = {
      name,
      email,
      phone,
      password,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    window.location.href = "home.html";
  });
});
