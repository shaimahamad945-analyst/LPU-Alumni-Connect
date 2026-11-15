
const SLOT_OPTIONS = {
  "Weekends": [
    "Saturday, 10:00 AM to 12:00 PM",
    "Saturday, 4:00 PM to 6:00 PM",
    "Sunday, 10:00 AM to 12:00 PM",
    "Sunday, 4:00 PM to 6:00 PM"
  ],
  "Weekday evenings": [
    "Monday, 6:00 PM to 8:00 PM",
    "Wednesday, 6:00 PM to 8:00 PM",
    "Friday, 6:00 PM to 8:00 PM"
  ],
  "Flexible": [
    "Any weekday, 5:00 PM to 8:00 PM",
    "Any weekend, 10:00 AM to 6:00 PM"
  ]
};

const MIN_MESSAGE = 20;

// Get logged-in session
let session = null;

try {
  const savedSession =
    localStorage.getItem("lpu_session") ||
    sessionStorage.getItem("lpu_session");

  session = savedSession ? JSON.parse(savedSession) : null;
} catch (e) {
  session = null;
}

// HTML elements
const profileLayout = document.getElementById("profileLayout");
const profileMain = document.getElementById("profileMain");
const notFound = document.getElementById("notFound");

const states = {
  login: document.getElementById("stateLogin"),
  alumni: document.getElementById("stateAlumni"),
  pending: document.getElementById("statePending"),
  form: document.getElementById("requestForm"),
  done: document.getElementById("stateDone")
};

// Show required state
function showState(name) {
  Object.keys(states).forEach((key) => {
    states[key].hidden = key !== name;
  });
}

// Escape HTML
function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Generate initials
function initials(name) {
  return name.split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// Load requests
function loadRequests() {
  try {
    const saved = JSON.parse(localStorage.getItem("lpu_requests"));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

// Save requests
function saveRequests(list) {
  localStorage.setItem("lpu_requests", JSON.stringify(list));
}

// Check pending request
function hasPending(mentor) {
  return loadRequests().some((r) =>
    r.mentorId === mentor.id &&
    r.studentId === session.id &&
    r.status === "Pending"
  );
}

// Field error handling
function setFieldError(input, message) {
  const field = input.closest(".form-field");
  field.classList.toggle("invalid", message !== "");
  field.querySelector(".field-error").textContent = message;
}

// Generate mentor profile HTML
function profileHtml(m) {
  const skills = m.skills
    .map((skill) => `<span class="chip">${esc(skill)}</span>`)
    .join("");

  const help = m.mentoring
    .map((item) => `<li><i class="bi bi-check-circle-fill"></i> ${esc(item)}</li>`)
    .join("");

  return `
    <article class="profile-card">
      <span class="badge badge--sample">Sample profile</span>

      <div class="profile-card__top">
        <div class="avatar avatar--lg">${initials(m.name)}</div>
        <div>
          <h1>${esc(m.name)}</h1>
          <p class="profile-card__role">${esc(m.role)}, ${esc(m.company)}</p>
        </div>
      </div>

      <div class="facts">
        <div class="fact">
          <i class="bi bi-building"></i>
          <div>
            <small>Company</small>
            <strong>${esc(m.company)}</strong>
          </div>
        </div>

        <div class="fact">
          <i class="bi bi-mortarboard"></i>
          <div>
            <small>Branch and batch</small>
            <strong>${esc(m.branch)}, ${m.batch}</strong>
          </div>
        </div>

        <div class="fact">
          <i class="bi bi-geo-alt"></i>
          <div>
            <small>Location</small>
            <strong>${esc(m.location)}</strong>
          </div>
        </div>

        <div class="fact">
          <i class="bi bi-clock"></i>
          <div>
            <small>Availability</small>
            <strong>${esc(m.availability)}</strong>
          </div>
        </div>
      </div>

      <h2>About</h2>
      <p>${esc(m.bio)}</p>

      <h2>Skills</h2>
      <div class="chips">${skills}</div>

      <h2>Can help you with</h2>
      <ul class="help-list">${help}</ul>
    </article>`;
}

// Fill select options
function fillOptions(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

// Build request form
function buildForm(mentor) {
  const form = states.form;
  const topic = document.getElementById("topic");
  const slot = document.getElementById("slot");
  const message = document.getElementById("message");
  const counter = document.getElementById("counter");

  fillOptions(topic, mentor.mentoring);
  fillOptions(
    slot,
    SLOT_OPTIONS[mentor.availability] || SLOT_OPTIONS["Flexible"]
  );

  topic.addEventListener("change", () => setFieldError(topic, ""));
  slot.addEventListener("change", () => setFieldError(slot, ""));

  message.addEventListener("input", () => {
    setFieldError(message, "");
    counter.textContent = message.value.length + " / " + message.maxLength;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;
    const text = message.value.trim();

    if (topic.value === "") {
      setFieldError(topic, "Please choose a topic.");
      valid = false;
    }

    if (slot.value === "") {
      setFieldError(slot, "Please choose a time slot.");
      valid = false;
    }

    if (text.length < MIN_MESSAGE) {
      setFieldError(
        message,
        "Please write at least " + MIN_MESSAGE +
        " characters about what you need."
      );
      valid = false;
    }

    if (!valid) return;

    const requests = loadRequests();

    requests.push({
      id: "r" + Date.now(),
      mentorId: mentor.id,
      mentorName: mentor.name,
      studentId: session.id,
      studentName: session.name,
      topic: topic.value,
      slot: slot.value,
      message: text,
      status: "Pending",
      createdAt: new Date().toISOString()
    });

    saveRequests(requests);

    document.getElementById("doneName").textContent = mentor.name;
    showState("done");
  });
}

// Setup request section
function setupRequest(mentor) {
  if (!session) {
    showState("login");
  } else if (session.role !== "student") {
    showState("alumni");
  } else if (hasPending(mentor)) {
    showState("pending");
  } else {
    showState("form");
    buildForm(mentor);
  }
}

// Initialize page
function init() {
  const params = new URLSearchParams(window.location.search);

  const mentor = MENTORS.find(
    (m) => m.id === params.get("id")
  );

  if (!mentor) {
    profileLayout.hidden = true;
    notFound.hidden = false;
    return;
  }

  document.title = mentor.name + " | LPU Alumni Connect";

  profileMain.innerHTML = profileHtml(mentor);

  setupRequest(mentor);
}

// Start
init();
