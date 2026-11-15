const dashMain = document.getElementById("dashMain");
const roleLabel = document.getElementById("roleLabel");
const dashTitle = document.getElementById("dashTitle");
const dashSub = document.getElementById("dashSub");
const headAction = document.getElementById("headAction");
const dashNotice = document.getElementById("dashNotice");
const reqList = document.getElementById("reqList");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");
const emptyAction = document.getElementById("emptyAction");
const filterTabs = document.querySelectorAll(".dir-tab");
const myEvents = document.getElementById("myEvents");
const myEventList = document.getElementById("myEventList");

let currentFilter = "all";

function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function initials(name) {
  return name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function loadRequests() {
  try {
    const saved = JSON.parse(localStorage.getItem("lpu_requests"));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function saveRequests(list) {
  localStorage.setItem("lpu_requests", JSON.stringify(list));
}

function visibleRequests() {
  const all = loadRequests();
  return session.role === "alumni"
    ? all
    : all.filter((r) => r.studentId === session.id);
}

function countByStatus(list, status) {
  return list.filter((r) => r.status === status).length;
}

function requestCard(r) {
  const isStudent = session.role === "student";
  const mentor = MENTORS.find((m) => m.id === r.mentorId);

  const whoName = isStudent ? r.mentorName : r.studentName;
  const whoLine = isStudent
    ? (mentor ? mentor.role + ", " + mentor.company : "Mentor")
    : "Student, Reg. No. " + r.studentId;
  const nameHtml = isStudent
    ? `<a href="profile.html?id=${esc(r.mentorId)}">${esc(whoName)}</a>`
    : esc(whoName);

  let actions = "";
  if (r.status === "Pending") {
    actions = isStudent
      ? `<div class="req-card__actions">
           <button type="button" class="btn btn--danger-outline" data-action="withdraw" data-id="${esc(r.id)}">
             <i class="bi bi-trash"></i> Withdraw
           </button>
         </div>`
      : `<div class="req-card__actions">
           <button type="button" class="btn btn--success" data-action="accept" data-id="${esc(r.id)}">
             <i class="bi bi-check-lg"></i> Accept
           </button>
           <button type="button" class="btn btn--danger-outline" data-action="decline" data-id="${esc(r.id)}">
             <i class="bi bi-x-lg"></i> Decline
           </button>
         </div>`;
  }

  const statusClass = r.status.toLowerCase();

  return `
    <article class="req-card req-card--${statusClass}">
      <div class="req-card__head">
        <div class="avatar avatar--sm">${initials(whoName)}</div>
        <div class="req-card__who">
          <h3>${nameHtml}</h3>
          <p>${esc(whoLine)}</p>
        </div>
        <span class="status status--${statusClass}">${esc(r.status)}</span>
      </div>
      <ul class="req-card__meta">
        <li><i class="bi bi-chat-dots"></i> ${esc(r.topic)}</li>
        <li><i class="bi bi-clock"></i> ${esc(r.slot)}</li>
        <li><i class="bi bi-calendar3"></i> Sent on ${formatDate(r.createdAt)}</li>
      </ul>
      <blockquote class="req-card__msg">${esc(r.message)}</blockquote>
      ${actions}
    </article>`;
}

function render() {
  const mine = visibleRequests();

  const counts = {
    all: mine.length,
    Pending: countByStatus(mine, "Pending"),
    Accepted: countByStatus(mine, "Accepted"),
    Declined: countByStatus(mine, "Declined")
  };

  document.querySelectorAll("[data-stat]").forEach((el) => {
    el.textContent = counts[el.dataset.stat];
  });

  filterTabs.forEach((tab) => {
    const active = tab.dataset.filter === currentFilter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });

  const filtered = currentFilter === "all"
    ? mine
    : mine.filter((r) => r.status === currentFilter);

  const shown = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  reqList.innerHTML = shown.map(requestCard).join("");
  emptyState.hidden = shown.length > 0;

  if (shown.length === 0) {
    const none = mine.length === 0;
    const isStudent = session.role === "student";

    emptyTitle.textContent = none
      ? "No requests yet"
      : "No " + currentFilter.toLowerCase() + " requests";
    emptyText.textContent = none
      ? (isStudent ? "Find a mentor and send your first request." : "Requests sent by students will appear here.")
      : "Try another status tab.";
    emptyAction.hidden = !(none && isStudent);
  }
}

reqList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "withdraw") {
    if (!confirm("Withdraw this request?")) return;
    saveRequests(loadRequests().filter((r) => r.id !== id));
  } else {
    const all = loadRequests();
    const req = all.find((r) => r.id === id);

    if (req) {
      req.status = action === "accept" ? "Accepted" : "Declined";
      saveRequests(all);
    }
  }

  render();
});

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentFilter = tab.dataset.filter;
    render();
  });
});

function eventRow(ev, now) {
  const state = eventState(ev, now);
  const label = { upcoming: "Upcoming", live: "Live now", past: "Completed" }[state];
  const cls = { upcoming: "pending", live: "accepted", past: "past" }[state];

  const cancel = state === "past" ? "" : `
    <div class="req-card__actions">
      <button type="button" class="btn btn--danger-outline" data-action="cancel-event" data-id="${esc(ev.id)}">
        <i class="bi bi-x-lg"></i> Cancel registration
      </button>
    </div>`;

  return `
    <article class="req-card req-card--${cls}">
      <div class="req-card__head">
        <div class="req-card__who">
          <h3><a href="events.html">${esc(ev.title)}</a></h3>
          <p>${esc(ev.type)}</p>
        </div>
        <span class="status status--${cls}">${label}</span>
      </div>
      <ul class="req-card__meta">
        <li><i class="bi bi-clock"></i> ${esc(formatWhen(ev))}</li>
        <li><i class="bi bi-geo-alt"></i> ${esc(ev.mode)}: ${esc(ev.place)}</li>
      </ul>
      ${cancel}
    </article>`;
}

function renderMyEvents() {
  const now = new Date();
  const mine = loadRegs().filter((r) => r.userId === session.id && r.role === session.role);

  const byId = {};
  getEvents().forEach((ev) => { byId[ev.id] = ev; });

  const list = mine
    .map((r) => byId[r.eventId])
    .filter(Boolean)
    .sort((a, b) => a.start - b.start);

  myEvents.hidden = list.length === 0;
  myEventList.innerHTML = list.map((ev) => eventRow(ev, now)).join("");
}

myEventList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='cancel-event']");
  if (!button) return;
  if (!confirm("Cancel your registration for this event?")) return;

  saveRegs(loadRegs().filter((r) =>
    !(r.eventId === button.dataset.id && r.userId === session.id && r.role === session.role)
  ));

  renderMyEvents();
});

function init() {
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const isStudent = session.role === "student";

  roleLabel.textContent = isStudent ? "Student dashboard" : "Alumni dashboard";
  dashTitle.textContent = "Welcome, " + session.name;
  dashSub.textContent = isStudent
    ? "Track your mentorship requests and sessions."
    : "Review mentorship requests and respond to them.";

  headAction.hidden = !isStudent;
  dashNotice.hidden = isStudent;
  dashMain.hidden = false;

  render();
  renderMyEvents();
}

init();