// Protect the data manager behind the Admin demo session.
(function () {
  try {
    const adminSession = JSON.parse(
      localStorage.getItem("lpu_admin_session") ||
      sessionStorage.getItem("lpu_admin_session") ||
      "null"
    );

    if (!adminSession || adminSession.role !== "admin") {
      window.location.replace("login.html");
    }

  } catch (error) {
    window.location.replace("login.html");
  }
})();


const MASK = "\u2022\u2022\u2022\u2022\u2022\u2022";

const summary = document.getElementById("summary");
const storageText = document.getElementById("storageText");
const meterBar = document.getElementById("meterBar");
const dataMsg = document.getElementById("dataMsg");
const tableTabs = document.getElementById("tableTabs");
const tableTitle = document.getElementById("tableTitle");
const togglePass = document.getElementById("togglePass");
const tableBox = document.getElementById("tableBox");
const emptyState = document.getElementById("emptyState");
const jsonBox = document.getElementById("jsonBox");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const resetBtn = document.getElementById("resetBtn");

let currentTable = "users";
let showPasswords = false;

const eventTitles = {};
EVENTS.forEach((e) => { eventTitles[e.id] = e.title; });

const jobLabels = {};
JOBS.forEach((j) => { jobLabels[j.id] = j.title + ", " + j.company; });

function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function fmt(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "-";

  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function say(message) {
  dataMsg.innerHTML = '<i class="bi bi-info-circle"></i> ' + esc(message);
  dataMsg.hidden = false;
}

const TABLES = {
  users: {
    title: "Users",
    icon: "bi-people",
    columns: ["Role", "Name", "Login ID", "Passout year", "Password"],
    rows: () => DB.all("users").map((u) => [
      u.role, u.name, u.id, u.year || "-", showPasswords ? u.password : MASK
    ]),
    raw: () => DB.all("users").map((u) =>
      Object.assign({}, u, showPasswords ? {} : { password: MASK })
    )
  },
  requests: {
    title: "Mentorship requests",
    icon: "bi-chat-dots",
    columns: ["Student", "Mentor", "Topic", "Status", "Sent on"],
    rows: () => DB.all("requests").map((r) => [
      (r.studentName || "-") + " (" + r.studentId + ")",
      r.mentorName, r.topic, r.status, fmt(r.createdAt)
    ]),
    raw: () => DB.all("requests")
  },
  eventRegs: {
    title: "Event registrations",
    icon: "bi-calendar-check",
    columns: ["Event", "Person", "Role", "Registered on"],
    rows: () => DB.all("eventRegs").map((r) => [
      eventTitles[r.eventId] || r.eventId,
      (r.name || "-") + " (" + r.userId + ")",
      r.role, fmt(r.createdAt)
    ]),
    raw: () => DB.all("eventRegs")
  },
  savedJobs: {
    title: "Saved jobs",
    icon: "bi-bookmark",
    columns: ["Job", "User ID", "Role", "Saved on"],
    rows: () => DB.all("savedJobs").map((s) => [
      jobLabels[s.jobId] || s.jobId, s.userId, s.role, fmt(s.createdAt)
    ]),
    raw: () => DB.all("savedJobs")
  },
  referrals: {
    title: "Referral requests",
    icon: "bi-send",
    columns: ["Job", "Company", "Student", "Status", "Sent on"],
    rows: () => DB.all("referrals").map((r) => [
      r.jobTitle, r.company,
      (r.name || "-") + " (" + r.userId + ")",
      r.status, fmt(r.createdAt)
    ]),
    raw: () => DB.all("referrals")
  },
  checklists: {
    title: "Resume checklists",
    icon: "bi-file-earmark-text",
    columns: ["User ID", "Items ticked"],
    rows: () => DB.checks.all().map((c) => [c.userId, String(c.count)]),
    raw: () => DB.checks.all()
  }
};

function renderSummary() {
  const use = DB.usage();
  const names = ["users", "requests", "eventRegs", "savedJobs", "referrals"];

  summary.innerHTML = names.map((name) => `
    <div class="stat-card">
      <i class="bi ${TABLES[name].icon}"></i>
      <div>
        <strong>${use.counts[name]}</strong>
        <span>${esc(TABLES[name].title)}</span>
      </div>
    </div>`).join("");

  storageText.textContent = use.kb + " KB used of about " + use.limitKb + " KB";
  meterBar.style.width = Math.max(use.percent, 1) + "%";
  meterBar.parentElement.setAttribute("aria-valuenow", use.percent);
}

function renderTabs() {
  tableTabs.innerHTML = Object.keys(TABLES).map((key) => {
    const active = key === currentTable;

    return `
      <button type="button" class="dir-tab ${active ? "active" : ""}"
              data-table="${key}" aria-pressed="${active}">
        <i class="bi ${TABLES[key].icon}"></i> ${esc(TABLES[key].title)}
        <span class="dir-tab__count">${TABLES[key].rows().length}</span>
      </button>`;
  }).join("");
}

function renderTable() {
  const table = TABLES[currentTable];
  const rows = table.rows();

  tableTitle.textContent = table.title + " (" + rows.length + ")";

  togglePass.hidden = currentTable !== "users";
  togglePass.innerHTML = showPasswords
    ? '<i class="bi bi-eye-slash"></i> Hide passwords'
    : '<i class="bi bi-eye"></i> Show passwords';

  const head = table.columns.map((c) => `<th>${esc(c)}</th>`).join("");
  const body = rows.map((row) =>
    "<tr>" + row.map((cell) => `<td>${esc(String(cell))}</td>`).join("") + "</tr>"
  ).join("");

  tableBox.innerHTML = rows.length === 0 ? "" : `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;

  emptyState.hidden = rows.length > 0;
  jsonBox.textContent = JSON.stringify(table.raw(), null, 2);
}

function render() {
  renderSummary();
  renderTabs();
  renderTable();
}

tableTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-table]");
  if (!button) return;

  currentTable = button.dataset.table;
  render();
});

togglePass.addEventListener("click", () => {
  showPasswords = !showPasswords;
  renderTable();
});

exportBtn.addEventListener("click", () => {
  const payload = DB.exportAll();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "lpu-alumni-connect-backup.json";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
  say("Backup downloaded. It contains passwords in plain text, so keep the file private.");
});

importBtn.addEventListener("click", () => importFile.click());

importFile.addEventListener("change", () => {
  const file = importFile.files[0];
  if (!file) return;

  if (!confirm("Importing replaces the matching data stored in this browser. Continue?")) {
    importFile.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    let payload = null;

    try {
      payload = JSON.parse(reader.result);
    } catch (e) {
      payload = null;
    }

    say(DB.importAll(payload).message);
    render();
  };

  reader.onerror = () => say("Could not read the file.");
  reader.readAsText(file);
  importFile.value = "";
});


resetBtn.addEventListener("click", () => {
  if (!confirm("Delete ALL data saved by this website in this browser? You will be logged out.")) return;

  DB.reset();
  say("All data cleared successfully. You have been logged out.");
  render();
});

if (!DB.available()) {
  say("Browser storage is blocked (private mode or blocked cookies), so data cannot be saved.");
}

render();