
"use strict";

const studentSignup = document.getElementById("studentSignupForm");
const alumniSignup = document.getElementById("alumniSignupForm");

const USERS_KEY = "lpu_users";

// Fill passout years
fillYears(document.getElementById("aYear"));

// Show validation errors
function setError(input, message) {
  const field = input.closest(".field");

  if (!field) return;

  field.classList.toggle("invalid", message !== "");

  const error = field.querySelector(".field__error");

  if (error) {
    error.textContent = message;
  }
}

// Read registered users
function loadUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    return Array.isArray(users) ? users : [];
  } catch (error) {
    return [];
  }
}

// Validate name
function validateName(input) {
  const name = input.value.trim();

  if (name === "") {
    setError(input, "Please enter your full name.");
    return false;
  }

  if (name.length < 3) {
    setError(input, "Name must contain at least 3 characters.");
    return false;
  }

  return true;
}

// Validate password
function validatePasswords(password, confirm) {
  let valid = true;

  if (password.value.length < 6) {
    setError(password, "Password must be at least 6 characters.");
    valid = false;
  }

  if (confirm.value !== password.value) {
    setError(confirm, "Passwords do not match.");
    valid = false;
  }

  return valid;
}

// Save new account
function finishSignup(form, newUser) {

  const formError = form.querySelector(".form-error");
  const formSuccess = form.querySelector(".form-success");
  const button = form.querySelector(".btn-login");

  const users = loadUsers();

  const exists = users.some(user =>
    user.role === newUser.role &&
    String(user.id).toLowerCase() ===
    String(newUser.id).toLowerCase()
  );

  if (exists) {
    formError.textContent =
      "Account already exists. Please sign in.";

    return;
  }

  users.push(newUser);

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    formError.textContent =
      "Unable to save account. Browser storage may be full or disabled.";
    return;
  }

  formError.textContent = "";

  formSuccess.textContent =
    "Account created successfully! Redirecting to login...";

  button.disabled = true;

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1200);
}

// Student registration
studentSignup.addEventListener("submit", function (event) {

  event.preventDefault();

  const name = document.getElementById("sName");
  const reg = document.getElementById("sReg");
  const password = document.getElementById("sPass");
  const confirm = document.getElementById("sConfirm");

  let valid = validateName(name);

  if (!/^\d{8}$/.test(reg.value.trim())) {
    setError(reg, "Registration number must be 8 digits.");
    valid = false;
  }

  if (!validatePasswords(password, confirm)) {
    valid = false;
  }

  if (valid) {
    finishSignup(studentSignup, {
      role: "student",
      id: reg.value.trim(),
      name: name.value.trim(),
      password: password.value
    });
  }

});

// Alumni registration
alumniSignup.addEventListener("submit", function (event) {

  event.preventDefault();

  const name = document.getElementById("aName");
  const email = document.getElementById("aEmail");
  const year = document.getElementById("aYear");
  const password = document.getElementById("aPass");
  const confirm = document.getElementById("aConfirm");

  let valid = validateName(name);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, "Enter a valid email address.");
    valid = false;
  }

  if (!year.value) {
    setError(year, "Select your passout year.");
    valid = false;
  }

  if (!validatePasswords(password, confirm)) {
    valid = false;
  }

  if (valid) {
    finishSignup(alumniSignup, {
      role: "alumni",
      id: email.value.trim(),
      name: name.value.trim(),
      year: year.value,
      password: password.value
    });
  }

});

// Clear errors while typing
document.querySelectorAll(".login-form input, .login-form select")
  .forEach(input => {
    input.addEventListener("input", () => setError(input, ""));
    input.addEventListener("change", () => setError(input, ""));
  });
