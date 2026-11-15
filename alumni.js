const tabs = document.querySelectorAll(".dir-tab");
const mentorFilters = document.getElementById("mentorFilters");
const mentorGrid = document.getElementById("mentorGrid");
const notableGrid = document.getElementById("notableGrid");
const searchInput = document.getElementById("searchInput");

let currentView = "mentors";

document.getElementById("mentorCount").textContent = MENTORS.length;
document.getElementById("notableCount").textContent = NOTABLE_ALUMNI.length;

function uniqueSorted(list, key) {
  return [...new Set(list.map((item) => item[key]))].sort();
}

function fillSelect(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

fillSelect(document.getElementById("filterBranch"), uniqueSorted(MENTORS, "branch"));
fillSelect(document.getElementById("filterCompany"), uniqueSorted(MENTORS, "company"));
fillSelect(document.getElementById("filterAvail"), uniqueSorted(MENTORS, "availability"));
fillSelect(document.getElementById("filterYear"), uniqueSorted(MENTORS, "batch").reverse());

function switchView(view) {
  currentView = view;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.view === view;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });

  mentorGrid.hidden = view !== "mentors";
  notableGrid.hidden = view !== "notable";
  mentorFilters.hidden = view !== "mentors";

  searchInput.placeholder = view === "mentors"
    ? "Search by name, company or skill"
    : "Search notable alumni by name or field";
  searchInput.value = "";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchView(tab.dataset.view));
});
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const notice = document.getElementById("notice");
const resetBtn = document.getElementById("resetBtn");

const filterBranch = document.getElementById("filterBranch");
const filterYear = document.getElementById("filterYear");
const filterCompany = document.getElementById("filterCompany");
const filterAvail = document.getElementById("filterAvail");
const filterControls = [filterBranch, filterYear, filterCompany, filterAvail];

function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function initials(name) {
  return name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function mentorCard(m) {
  const skills = m.skills
    .slice(0, 3)
    .map((skill) => `<span class="chip">${esc(skill)}</span>`)
    .join("");

  return `
    <article class="person-card">
      <span class="badge badge--sample">Sample profile</span>
      <div class="person-card__top">
        <div class="avatar">${initials(m.name)}</div>
        <div>
          <h3>${esc(m.name)}</h3>
          <p class="person-card__role">${esc(m.role)}</p>
        </div>
      </div>
      <ul class="person-card__meta">
        <li><i class="bi bi-building"></i> ${esc(m.company)}</li>
        <li><i class="bi bi-mortarboard"></i> ${esc(m.branch)}, Batch ${m.batch}</li>
        <li><i class="bi bi-geo-alt"></i> ${esc(m.location)}</li>
      </ul>
      <div class="chips">${skills}</div>
      <div class="person-card__foot">
        <span class="avail"><i class="bi bi-clock"></i> ${esc(m.availability)}</span>
        <a href="profile.html?id=${m.id}" class="btn btn--solid">View profile</a>
      </div>
    </article>`;
}

function notableCard(n) {
  const studied = n.studied
    ? `<li><i class="bi bi-mortarboard"></i> ${esc(n.studied)} at LPU</li>`
    : "";

  return `
    <article class="person-card">
      <span class="badge">${esc(n.tag)}</span>
      <div class="person-card__top">
        <div class="avatar avatar--orange">${initials(n.name)}</div>
        <div>
          <h3>${esc(n.name)}</h3>
          <p class="person-card__role">${esc(n.role)}</p>
        </div>
      </div>
      <ul class="person-card__meta">
        <li><i class="bi bi-tag"></i> ${esc(n.field)}</li>
        ${studied}
      </ul>
      <p class="person-card__note">${esc(n.note)}</p>
      <div class="person-card__foot">
        <a href="${n.sourceUrl}" target="_blank" rel="noopener noreferrer" class="source-link">
          <i class="bi bi-box-arrow-up-right"></i> Source: ${esc(n.sourceLabel)}
        </a>
      </div>
    </article>`;
}

function filterMentors() {
  const query = searchInput.value.trim().toLowerCase();
  const branch = filterBranch.value;
  const year = filterYear.value;
  const company = filterCompany.value;
  const avail = filterAvail.value;

  return MENTORS.filter((m) => {
    const text = [m.name, m.company, m.role, m.location, ...m.skills]
      .join(" ")
      .toLowerCase();

    return (query === "" || text.includes(query))
      && (branch === "" || m.branch === branch)
      && (year === "" || String(m.batch) === year)
      && (company === "" || m.company === company)
      && (avail === "" || m.availability === avail);
  });
}

function filterNotable() {
  const query = searchInput.value.trim().toLowerCase();

  return NOTABLE_ALUMNI.filter((n) => {
    const text = [n.name, n.role, n.field, n.tag].join(" ").toLowerCase();
    return query === "" || text.includes(query);
  });
}

function render() {
  const isMentors = currentView === "mentors";
  const list = isMentors ? filterMentors() : filterNotable();
  const grid = isMentors ? mentorGrid : notableGrid;
  const buildCard = isMentors ? mentorCard : notableCard;

  grid.innerHTML = list.map(buildCard).join("");
  emptyState.hidden = list.length > 0;

  const label = isMentors ? (list.length === 1 ? "mentor" : "mentors") : "notable alumni";
  resultCount.textContent = list.length + " " + label + " found";

  notice.innerHTML = isMentors
    ? '<i class="bi bi-info-circle"></i> Mentor profiles are sample data created for this project. Real alumni join through Sign Up.'
    : '<i class="bi bi-info-circle"></i> Public information only. Each card links to its source. "Studied at LPU" means the person was enrolled at the university.';
}

searchInput.addEventListener("input", render);

filterControls.forEach((control) => {
  control.addEventListener("change", render);
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterControls.forEach((control) => { control.value = ""; });
  render();
});

render();