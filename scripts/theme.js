const toggle = document.getElementById("themeToggle");
const root = document.documentElement;
const logo = document.querySelector(".brand-logo");

const savedTheme = localStorage.getItem("theme") || "light";
root.dataset.theme = savedTheme;
updateUI(savedTheme);

toggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  updateUI(nextTheme);
});

function updateUI(theme) {
  toggle.querySelector("span").textContent =
    theme === "dark" ? "☀️" : "🌙";

  if (logo) {
    logo.src =
      theme === "dark"
        ? "images/brand/logo-dark.svg"
        : "images/brand/logo.svg";
  }
}
