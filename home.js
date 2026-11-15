document.documentElement.classList.add("js-ready");

const navbar = document.querySelector(".navbar");
const menuBtn = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function onScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.innerHTML = open
    ? '<i class="bi bi-x-lg"></i>'
    : '<i class="bi bi-list"></i>';
}

menuBtn.addEventListener("click", () => {
  setMenu(!navLinks.classList.contains("open"));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

function animateCount(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const counters = document.querySelectorAll("[data-count]");
const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      if (entry.target.hasAttribute("data-count")) animateCount(entry.target);
      if (entry.target.classList.contains("reveal")) entry.target.classList.add("visible");

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  counters.forEach((el) => observer.observe(el));
  reveals.forEach((el) => observer.observe(el));
} else {
  counters.forEach((el) => {
    el.textContent = Number(el.dataset.count).toLocaleString() + (el.dataset.suffix || "");
  });
  reveals.forEach((el) => el.classList.add("visible"));
}

let session = null;
try {
  session = JSON.parse(localStorage.getItem("lpu_session") || sessionStorage.getItem("lpu_session"));
} catch (e) {
  session = null;
}

if (session) {
  const actions = document.getElementById("navActions");

  const dashLink = document.createElement("a");
  dashLink.href = "dashboard.html";
  dashLink.className = "btn btn--solid";
  dashLink.textContent = session.name.split(" ")[0];

  const logoutBtn = document.createElement("button");
  logoutBtn.type = "button";
  logoutBtn.className = "btn btn--ghost";
  logoutBtn.textContent = "Log out";
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("lpu_session");
    sessionStorage.removeItem("lpu_session");
    window.location.reload();
  });

  actions.querySelectorAll(".btn").forEach((btn) => btn.remove());
  actions.prepend(logoutBtn);
  actions.prepend(dashLink);
}

document.getElementById("year").textContent = new Date().getFullYear();