import { getCurrentUser, logout } from "./auth.js";

const nameEl = document.querySelector(".js-profile-name");
const emailEl = document.querySelector(".js-profile-email");
const phoneEl = document.querySelector(".js-profile-phone");
const logoutBtn = document.querySelector(".js-logout-btn");

const user = getCurrentUser();

if (!user) {
  window.location.href = "login.html";
} else {
  if (nameEl) nameEl.innerText = user.name;
  if (emailEl) emailEl.innerText = user.email;
  if (phoneEl) phoneEl.innerText = user.phone;
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logout();
    window.location.href = "login.html";
  });
}
