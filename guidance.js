const guideTabs = document.querySelectorAll(".dir-tab");
const views = {
  paths: document.getElementById("view-paths"),
  resume: document.getElementById("view-resume"),
  interview: document.getElementById("view-interview")
};

const pathPicker = document.getElementById("pathPicker");
const pathDetail = document.getElementById("pathDetail");
const checklistEl = document.getElementById("checklist");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const progressMsg = document.getElementById("progressMsg");
const qaList = document.getElementById("qaList");

const TOTAL_ITEMS = RESUME_GROUPS.reduce((sum, group) => sum + group.items.length, 0);
const CHECK_KEY = "lpu_resume_" + (session ? session.id : "guest");

function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function initials(name) {
  return name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function showView(name) {
  guideTabs.forEach((tab) => {
    const active = tab.dataset.view === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });

  Object.keys(views).forEach((key) => {
    views[key].hidden = key !== name;
  });
}

guideTabs.forEach((tab) => {
  tab.addEventListener("click", () => showView(tab.dataset.view));
});

function buildPicker() {
  pathPicker.innerHTML = CAREER_PATHS.map((p) => `
    <button type="button" class="path-chip" data-path="${p.id}" aria-pressed="false">
      <i class="bi ${p.icon}"></i> ${esc(p.label)}
    </button>`).join("");
}

function mentorsFor(path) {
  return MENTORS.filter((m) => {
    const byBranch = path.mentorBranch && m.branch === path.mentorBranch;
    const byTopic = path.mentorTopic &&
      m.mentoring.some((topic) => topic.toLowerCase().includes(path.mentorTopic));
    return Boolean(byBranch || byTopic);
  }).slice(0, 3);
}

function renderDetail(path) {
  const roles = path.roles.map((r) => `<span class="chip">${esc(r)}</span>`).join("");
  const skills = path.skills.map((s) => `<span class="chip">${esc(s)}</span>`).join("");

  const steps = path.steps.map((s) => `
    <li class="timeline__item">
      <span class="timeline__when">${esc(s.when)}</span>
      <h4>${esc(s.title)}</h4>
      <p>${esc(s.text)}</p>
    </li>`).join("");

  const mentors = mentorsFor(path).map((m) => `
    <a class="mini-mentor" href="profile.html?id=${m.id}">
      <div class="avatar">${initials(m.name)}</div>
      <div class="mini-mentor__text">
        <strong>${esc(m.name)}</strong>
        <span>${esc(m.role)}, ${esc(m.company)}</span>
      </div>
      <i class="bi bi-chevron-right"></i>
    </a>`).join("");

  pathDetail.innerHTML = `
    <div class="path-head">
      <h2>${esc(path.label)}</h2>
      <p>${esc(path.summary)}</p>
    </div>
    <div class="path-layout">
      <section class="info-card">
        <h3>Your roadmap</h3>
        <ol class="timeline">${steps}</ol>
      </section>
      <div class="side-stack">
        <section class="info-card">
          <h3>Typical roles</h3>
          <div class="chips">${roles}</div>
        </section>
        <section class="info-card">
          <h3>Skills to build</h3>
          <div class="chips">${skills}</div>
        </section>
        <section class="info-card">
          <h3>Mentors in this area</h3>
          ${mentors}
          <p class="info-card__note">Sample profiles created for this project.</p>
        </section>
      </div>
    </div>`;
}

function selectPath(id) {
  pathPicker.querySelectorAll(".path-chip").forEach((chip) => {
    const active = chip.dataset.path === id;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-pressed", String(active));
  });

  renderDetail(CAREER_PATHS.find((p) => p.id === id));
}

pathPicker.addEventListener("click", (event) => {
  const chip = event.target.closest("button[data-path]");
  if (!chip) return;
  selectPath(chip.dataset.path);
});

function loadChecks() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHECK_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function updateProgress() {
  const done = checklistEl.querySelectorAll("input:checked").length;
  const percent = Math.round((done / TOTAL_ITEMS) * 100);

  progressBar.style.width = percent + "%";
  progressBar.parentElement.setAttribute("aria-valuenow", percent);
  progressText.textContent = done + " of " + TOTAL_ITEMS + " done";

  if (done === 0) {
    progressMsg.textContent = "Tick items as you improve your resume. Your progress is saved in this browser.";
  } else if (done === TOTAL_ITEMS) {
    progressMsg.textContent = "All done. Ask a mentor to review your resume before you apply.";
  } else {
    progressMsg.textContent = (TOTAL_ITEMS - done) + " to go. Keep improving it.";
  }
}

function renderChecklist() {
  const saved = loadChecks();

  checklistEl.innerHTML = RESUME_GROUPS.map((group) => `
    <section class="info-card">
      <h3>${esc(group.title)}</h3>
      <ul>
        ${group.items.map((item) => `
          <li>
            <label class="check-item">
              <input type="checkbox" data-id="${item.id}" ${saved.includes(item.id) ? "checked" : ""}>
              <span>${esc(item.text)}</span>
            </label>
          </li>`).join("")}
      </ul>
    </section>`).join("");

  updateProgress();
}

checklistEl.addEventListener("change", (event) => {
  if (!event.target.matches("input[type='checkbox']")) return;

  const ids = Array.from(checklistEl.querySelectorAll("input:checked"))
    .map((box) => box.dataset.id);

  localStorage.setItem(CHECK_KEY, JSON.stringify(ids));
  updateProgress();
});

document.getElementById("resetChecks").addEventListener("click", () => {
  if (!confirm("Clear all ticks in the checklist?")) return;
  localStorage.removeItem(CHECK_KEY);
  renderChecklist();
});

function renderQuestions() {
  qaList.innerHTML = QA_GROUPS.map((group, g) => `
    <section class="qa-group">
      <h3><i class="bi ${group.icon}"></i> ${esc(group.title)}</h3>
      ${group.items.map((item, i) => `
        <div class="qa-item">
          <button type="button" class="qa-q" aria-expanded="false" aria-controls="qa-${g}-${i}">
            <span>${esc(item.q)}</span>
            <i class="bi bi-chevron-down"></i>
          </button>
          <div class="qa-a" id="qa-${g}-${i}" hidden>
            <p>${esc(item.tip)}</p>
          </div>
        </div>`).join("")}
    </section>`).join("");
}

qaList.addEventListener("click", (event) => {
  const button = event.target.closest(".qa-q");
  if (!button) return;

  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  document.getElementById(button.getAttribute("aria-controls")).hidden = isOpen;
});

buildPicker();
selectPath(CAREER_PATHS[0].id);
renderChecklist();
renderQuestions();

const startView = window.location.hash.replace("#", "");
showView(Object.keys(views).includes(startView) ? startView : "paths");