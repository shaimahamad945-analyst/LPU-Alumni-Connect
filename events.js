const eventTabs = document.querySelectorAll(".dir-tab");
const eventGrid = document.getElementById("eventGrid");
const typeFilter = document.getElementById("typeFilter");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");

const allEvents = getEvents();
const eventsById = {};
allEvents.forEach((ev) => { eventsById[ev.id] = ev; });

let currentView = "upcoming";
let toastTimer;

function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function countdownText(ev, now) {
  if (now >= ev.end) return "Completed";
  if (now >= ev.start) return "Happening now";

  let left = Math.floor((ev.start - now) / 1000);
  const days = Math.floor(left / 86400);
  left %= 86400;
  const hours = Math.floor(left / 3600);
  left %= 3600;
  const mins = Math.floor(left / 60);
  const secs = left % 60;

  return "Starts in " + days + "d " + pad(hours) + "h " + pad(mins) + "m " + pad(secs) + "s";
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
}

function fillTypes() {
  const types = [...new Set(EVENTS.map((e) => e.type))].sort();

  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });
}

function listFor(view, now) {
  const type = typeFilter.value;

  return allEvents
    .filter((ev) => type === "" || ev.type === type)
    .filter((ev) => view === "past"
      ? eventState(ev, now) === "past"
      : eventState(ev, now) !== "past")
    .sort((a, b) => view === "past" ? b.start - a.start : a.start - b.start);
}

function actionsHtml(ev, state) {
  if (state === "past") {
    return `<span class="avail"><i class="bi bi-check2-all"></i> Event ended</span>`;
  }

  if (!session) {
    return `<a href="login.html" class="btn btn--solid">
              <i class="bi bi-box-arrow-in-right"></i> Login to register
            </a>`;
  }

  if (isRegistered(ev.id)) {
    return `<span class="reg-pill"><i class="bi bi-check-circle-fill"></i> Registered</span>
            <button type="button" class="link-btn" data-action="cancel" data-id="${ev.id}">Cancel</button>`;
  }

  return `<button type="button" class="btn btn--primary" data-action="register" data-id="${ev.id}">
            <i class="bi bi-calendar-plus"></i> Register
          </button>`;
}

function eventCard(ev, now) {
  const state = eventState(ev, now);
  const speaker = ev.speakerId ? MENTORS.find((m) => m.id === ev.speakerId) : null;
  const modeIcon = ev.mode === "Online" ? "bi-laptop" : "bi-building";
  const month = ev.start.toLocaleDateString("en-IN", { month: "short" });

  const speakerHtml = speaker
    ? `<li><i class="bi bi-mic"></i>
         <a href="profile.html?id=${speaker.id}">${esc(speaker.name)}</a>, ${esc(speaker.company)}</li>`
    : `<li><i class="bi bi-people"></i> Open to all students and alumni</li>`;

  return `
    <article class="person-card event-card">
      <span class="badge">${esc(ev.type)}</span>
      <div class="event-card__top">
        <div class="date-block">
          <div class="date-block__month">${month}</div>
          <div class="date-block__day">${ev.start.getDate()}</div>
        </div>
        <h3>${esc(ev.title)}</h3>
      </div>
      <p class="person-card__note">${esc(ev.description)}</p>
      <ul class="person-card__meta">
        <li><i class="bi bi-clock"></i> ${esc(formatWhen(ev))}</li>
        <li><i class="bi ${modeIcon}"></i> ${esc(ev.mode)}: ${esc(ev.place)}</li>
        ${speakerHtml}
      </ul>
      <p class="countdown countdown--${state}" data-id="${ev.id}" data-state="${state}">
        <i class="bi bi-hourglass-split"></i> <span>${countdownText(ev, now)}</span>
      </p>
      <div class="person-card__foot">${actionsHtml(ev, state)}</div>
    </article>`;
}

function render() {
  const now = new Date();
  const list = listFor(currentView, now);

  eventGrid.innerHTML = list.map((ev) => eventCard(ev, now)).join("");
  emptyState.hidden = list.length > 0;
  resultCount.textContent = list.length + (list.length === 1 ? " event" : " events");

  const upcoming = allEvents.filter((ev) => eventState(ev, now) !== "past").length;
  document.getElementById("upcomingCount").textContent = upcoming;
  document.getElementById("pastCount").textContent = allEvents.length - upcoming;
}

function switchEventView(view) {
  currentView = view;

  eventTabs.forEach((tab) => {
    const active = tab.dataset.view === view;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });

  render();
}

eventTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchEventView(tab.dataset.view));
});

typeFilter.addEventListener("change", render);

eventGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const ev = eventsById[button.dataset.id];
  if (!ev) return;

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  if (button.dataset.action === "register") {
    if (!isRegistered(ev.id)) {
      const regs = loadRegs();

      regs.push({
        id: "g" + Date.now(),
        eventId: ev.id,
        userId: session.id,
        role: session.role,
        name: session.name,
        createdAt: new Date().toISOString()
      });

      saveRegs(regs);
      showToast("You are registered for " + ev.title + ".");
    }
  } else {
    if (!confirm("Cancel your registration for this event?")) return;

    saveRegs(loadRegs().filter((r) =>
      !(r.eventId === ev.id && r.userId === session.id && r.role === session.role)
    ));
    showToast("Registration cancelled.");
  }

  render();
});

setInterval(() => {
  const now = new Date();
  let stateChanged = false;

  document.querySelectorAll(".countdown").forEach((el) => {
    const ev = eventsById[el.dataset.id];

    if (eventState(ev, now) !== el.dataset.state) {
      stateChanged = true;
      return;
    }

    el.querySelector("span").textContent = countdownText(ev, now);
  });

  if (stateChanged) render();
}, 1000);

fillTypes();
render();