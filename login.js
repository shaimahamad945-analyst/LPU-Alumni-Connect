
(function () {
  "use strict";

  const USERS_KEY = "lpu_users";
  // Admin credentials - change these to your own
const ADMIN_ID = "Shaim0905";
const ADMIN_PASSWORD = "0905";

  const studentForm = document.getElementById("studentForm");
  const studentReg = document.getElementById("studentReg");
  const studentPass = document.getElementById("studentPass");

  const alumniForm = document.getElementById("alumniForm");
  const alumniEmail = document.getElementById("alumniEmail");
  const alumniYear = document.getElementById("alumniYear");
  const alumniPass = document.getElementById("alumniPass");
  // Admin login elements
const adminForm = document.getElementById("adminLoginForm");
const adminId = document.getElementById("adminId");
const adminPassword = document.getElementById("adminPassword");

  if (!studentForm || !alumniForm || !adminForm) {
    console.error("Login forms not found.");
    return;
  }

  // Read registered users from LocalStorage
  function readUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY));
      return Array.isArray(users) ? users : [];
    } catch (error) {
      return [];
    }
  }

  // Fill alumni passout years
  function fillYearOptions(select) {
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 2008; year--) {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      select.appendChild(option);
    }
  }

  if (alumniYear.options.length <= 1) {
    fillYearOptions(alumniYear);
  }

  // Display field validation errors
  function fieldError(input, message) {
    const field = input.closest(".field");
    if (!field) return;

    field.classList.toggle("invalid", message !== "");

    const error = field.querySelector(".field__error");
    if (error) error.textContent = message;
  }

  // Display login error
  function showFormError(form, message) {
    const error = form.querySelector(".form-error");
    if (error) error.textContent = message;
  }

  // Find the registered user
  function findUser(role, credentials) {
    return readUsers().find(user =>
      user.role === role &&
      String(user.id).toLowerCase() === credentials.id.toLowerCase() &&
      user.password === credentials.password &&
      (
        role !== "alumni" ||
        String(user.year) === String(credentials.year)
      )
    );
  }

  // Save login session
  function saveSession(user, remember) {
    localStorage.removeItem("lpu_session");
    sessionStorage.removeItem("lpu_session");

    const session = {
      role: user.role,
      name: user.name,
      id: user.id
    };

    const storage = remember ? localStorage : sessionStorage;

    storage.setItem("lpu_session", JSON.stringify(session));
  }

  // Login process
  function attemptLogin(role, credentials, form) {
    const button = form.querySelector(".btn-login");
    const remember = form.querySelector(".check input");

    showFormError(form, "");

    const user = findUser(role, credentials);

    if (!user) {
      showFormError(
        form,
        role === "student"
          ? "Account not found. Check your registration number and password, or sign up first."
          : "Account not found. Check your email, passout year and password, or sign up first."
      );
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = "Signing in...";
    }

    saveSession(user, remember ? remember.checked : false);

    window.location.href = "dashboard.html";
  }

  // Student login
  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let valid = true;

    const registration = studentReg.value.trim();
    const password = studentPass.value;

    if (!/^\d{8}$/.test(registration)) {
      fieldError(studentReg, "Enter a valid 8-digit registration number.");
      valid = false;
    } else {
      fieldError(studentReg, "");
    }

    if (password.length < 6) {
      fieldError(studentPass, "Password must be at least 6 characters.");
      valid = false;
    } else {
      fieldError(studentPass, "");
    }

    if (valid) {
      attemptLogin(
        "student",
        {
          id: registration,
          password: password
        },
        studentForm
      );
    }
  });

  // Alumni login
  alumniForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let valid = true;

    const email = alumniEmail.value.trim();
    const year = alumniYear.value;
    const password = alumniPass.value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldError(alumniEmail, "Enter a valid email address.");
      valid = false;
    } else {
      fieldError(alumniEmail, "");
    }

    if (!year) {
      fieldError(alumniYear, "Select your passout year.");
      valid = false;
    } else {
      fieldError(alumniYear, "");
    }

    if (password.length < 6) {
      fieldError(alumniPass, "Password must be at least 6 characters.");
      valid = false;
    } else {
      fieldError(alumniPass, "");
    }

    if (valid) {
      attemptLogin(
        "alumni",
        {
          id: email,
          year: year,
          password: password
        },
        alumniForm
      );
    }
  });

  // Admin login
  if (adminForm) {
    adminForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const enteredId = adminId.value.trim();
      const enteredPassword = adminPassword.value;

      const error = document.getElementById("adminError");

      if (error) {
        error.textContent = "";
      }

      if (
        enteredId !== ADMIN_ID ||
        enteredPassword !== ADMIN_PASSWORD
      ) {
        if (error) {
          error.textContent = "Invalid Admin ID or Password.";
        }
        return;
      }

      const adminSession = {
        role: "admin",
        name: "Administrator",
        id: ADMIN_ID
      };

      localStorage.removeItem("lpu_session");
      sessionStorage.removeItem("lpu_session");

      localStorage.setItem(
        "lpu_admin_session",
        JSON.stringify(adminSession)
      );

      window.location.href = "admin.html";
    });
  }


  // Clear errors while typing
  [studentReg, studentPass, alumniEmail, alumniYear, alumniPass]
    .forEach(input => {
      input.addEventListener("input", () => fieldError(input, ""));
      input.addEventListener("change", () => fieldError(input, ""));
    });

  // Redirect already logged-in users
  if (
    localStorage.getItem("lpu_session") ||
    sessionStorage.getItem("lpu_session")
  ) {
    window.location.href = "dashboard.html";
  }

})();
