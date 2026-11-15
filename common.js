
function fillYears(select) {
  const thisYear = new Date().getFullYear();
  for (let y = thisYear; y >= 2008; y--) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    select.appendChild(option);
  }
}

(function () {
  const tabsBox = document.querySelector(".role-tabs");
  if (!tabsBox) return;

  const buttons = tabsBox.querySelectorAll(".role-tab");
  const panels = document.querySelectorAll(".role-panel");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const role = button.dataset.role;

      buttons.forEach((b) => b.classList.toggle("active", b === button));
      panels.forEach((p) => p.classList.toggle("active", p.id === role + "Panel"));
      tabsBox.classList.toggle("alumni", role === "alumni");
      tabsBox.classList.toggle("admin", role === "admin");
    });
  });
})();

// Password Show / Hide Functionality
document.addEventListener("click", function (event) {
  const toggle = event.target.closest(".field__toggle");
  if (!toggle) return;

  const field = toggle.closest(".field__control");
  if (!field) return;

  const passwordInput = field.querySelector("input");
  if (!passwordInput) return;

  const showPassword = passwordInput.type === "password";
  passwordInput.type = showPassword ? "text" : "password";

  const icon = toggle.querySelector("i");

  if (icon) {
    icon.classList.toggle("bi-eye", !showPassword);
    icon.classList.toggle("bi-eye-slash", showPassword);
  }

  toggle.setAttribute(
    "aria-label",
    showPassword ? "Hide password" : "Show password"
  );
});
