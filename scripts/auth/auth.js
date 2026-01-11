const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

/* -----------------------------
   Helpers
----------------------------- */

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

/* -----------------------------
   Signup
----------------------------- */

export function signup({ name, email, phone, password }) {
  const users = getUsers();

  const exists = users.find((u) => u.email === email);
  if (exists) {
    throw new Error("User already exists with this email.");
  }

  const user = {
    id: Date.now(),
    name,
    email,
    phone,
    password
  };

  users.push(user);
  saveUsers(users);

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/* -----------------------------
   Login
----------------------------- */

export function login(email, password) {
  const users = getUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/* -----------------------------
   Logout
----------------------------- */

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/* -----------------------------
   Route Guard
----------------------------- */

export function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
}
