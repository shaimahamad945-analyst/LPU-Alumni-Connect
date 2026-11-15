const jobTabs = document.querySelectorAll(".dir-tab");
const toolbar = document.getElementById("toolbar");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const locationFilter = document.getElementById("locationFilter");
const modeFilter = document.getElementById("modeFilter");
const resetBtn = document.getElementById("resetBtn");
const resultCount = document.getElementById("resultCount");
const jobGrid = document.getElementById("jobGrid");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");
const emptyAction = document.getElementById("emptyAction");
const toast = document.getElementById("toast");

const referDialog = document.getElementById("referDialog");
const referForm = document.getElementById("referForm");
const referJobLine = document.getElementById("referJobLine");
const referMessage = document.getElementById("referMessage");
const referCounter = document.getElementById("referCounter");
const referError = document.getElementById("referError");

const MIN_REFERRAL = 15;

const jobsById = {};
JOBS.forEach((job) => { jobsById[job.id] = job; });

let currentView = "all";
let referJob = null;
let toastTimer;

function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
}

function uniqueSorted(key) {
  return [...new Set(JOBS.map((job) => job[key]))].sort();
}

function fillSelect(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function filterJobs() {
  const query = searchInput.value.trim().toLowerCase();
  const type = typeFilter.value;
  const place = locationFilter.value;
  const mode = modeFilter.value;

  return JOBS.filter((job) => {
    const text = [job.title, job.company, job.location, ...job.skills].join(" ").toLowerCase();

    return (query === "" || text.includes(query))
      && (type === "" || job.type === type)
      && (place === "" || job.location === place)
      && (mode === "" || job.mode === mode);
  }).sort((a, b) => a.daysAgo - b.daysAgo);
}

function savedJobsList() {
  return loadSavedJobs()
    .filter((s) => s.userId === session.id && s.role === session.role)
    .map((s) => jobsById[s.jobId])
    .filter(Boolean)
    .sort((a, b) => a.daysAgo - b.daysAgo);
}

function myReferrals() {
  return loadReferrals()
    .filter((r) => r.userId === session.id && r.role === session.role)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function referralHtml(job) {
  if (!session) {
    return `<a href="login.html" class="btn btn--solid">
              <i class="bi bi-box-arrow-in-right"></i> Login to request
            </a>`;
  }

  if (session.role !== "student") {
    return `<span class="avail"><i class="bi bi-info-circle"></i> Referrals: students only</span>`;
  }

  if (referralFor(job.id)) {
    return `<span class="ref-state">
              <span class="reg-pill"><i class="bi bi-check-circle-fill"></i> Requested</span>
              <button type="button" class="link-btn" data-action="withdraw" data-id="${job.id}">Withdraw</button>
            </span>`;
  }

  return `<button type="button" class="btn btn--primary" data-action="refer" data-id="${job.id}">
            <i class="bi bi-send"></i> Request referral
          </button>`;
}

function jobCard(job) {
  const poster = MENTORS.find((m) => m.id === job.posterId);
  const saved = isJobSaved(job.id);
  const skills = job.skills.map((s) => `<span class="chip">${esc(s)}</span>`).join("");

  const posterRow = poster
    ? `<li><i class="bi bi-person-check"></i> Posted by
         <a href="profile.html?id=${poster.id}">${esc(poster.name)}</a>, Batch ${poster.batch}</li>`
    : "";

  return `
    <article class="person-card job-card">
      <span class="badge">${esc(job.type)}</span>
      <div class="job-card__top">
        <div class="company-logo">${esc(job.company.charAt(0))}</div>
        <div>
          <h3>${esc(job.title)}</h3>
          <p class="person-card__role">${esc(job.company)}</p>
        </div>
      </div>
      <ul class="person-card__meta">
        <li><i class="bi bi-geo-alt"></i> ${esc(job.location)}, ${esc(job.mode)}</li>
        <li><i class="bi bi-mortarboard"></i> ${esc(job.eligibility)}</li>
        ${posterRow}
        <li><i class="bi bi-clock-history"></i> ${postedText(job.daysAgo)}</li>
      </ul>
      <div class="chips">${skills}</div>
      <p class="person-card__note">${esc(job.description)}</p>
      <div class="person-card__foot">
        <button type="button" class="save-btn ${saved ? "saved" : ""}"
                data-action="save" data-id="${job.id}" aria-pressed="${saved}">
          <i class="bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"}"></i> ${saved ? "Saved" : "Save"}
        </button>
        ${referralHtml(job)}
      </div>
    </article>`;
}

function referralCard(r) {
  const job = jobsById[r.jobId];
  const place = job ? ", " + job.location + ", " + job.mode : "";
  const date = new Date(r.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  return `
    <article class="req-card req-card--pending">
      <div class="req-card__head">
        <div class="company-logo company-logo--sm">${esc(r.company.charAt(0))}</div>
        <div class="req-card__who">
          <h3>${esc(r.jobTitle)}</h3>
          <p>${esc(r.company)}${esc(place)}</p>
        </div>
        <span class="status status--pending">${esc(r.status)}</span>
      </div>
      <ul class="req-card__meta">
        <li><i class="bi bi-person-check"></i> Posted by ${esc(r.posterName)}</li>
        <li><i class="bi bi-calendar3"></i> Sent on ${date}</li>
      </ul>
      <blockquote class="req-card__msg">${esc(r.message)}</blockquote>
      <div class="req-card__actions">
        <button type="button" class="btn btn--danger-outline" data-action="withdraw" data-id="${esc(r.jobId)}">
          <i class="bi bi-trash"></i> Withdraw
        </button>
      </div>
    </article>`;
}

function listForView() {
  if (currentView === "all") return filterJobs();
  if (!session) return [];
  return currentView === "saved" ? savedJobsList() : myReferrals();
}

function setEmpty() {
  let title;
  let text;
  let showLogin = false;

  if (currentView === "all") {
    title = "No openings found";
    text = "Try a different search or clear the filters.";
  } else if (!session) {
    title = "Login required";
    text = currentView === "saved"
      ? "Login to see the jobs you saved."
      : "Login to see your referral requests.";
    showLogin = true;
  } else if (currentView === "saved") {
    title = "No saved jobs yet";
    text = "Tap Save on a job and it will appear here.";
  } else {
    title = "No referral requests yet";
    text = session.role === "student"
      ? "Open a job and choose Request referral."
      : "Referral requests are available to students.";
  }

  emptyTitle.textContent = title;
  emptyText.textContent = text;
  emptyAction.hidden = !showLogin;
}

function render() {
  const list = listForView();
  const isAll = currentView === "all";
  const nouns = {
    all: ["opening", "openings"],
    saved: ["saved job", "saved jobs"],
    referrals: ["referral request", "referral requests"]
  }[currentView];

  toolbar.hidden = !isAll;
  jobGrid.innerHTML = list.map(currentView === "referrals" ? referralCard : jobCard).join("");
  emptyState.hidden = list.length > 0;
  resultCount.textContent = list.length + " " + (list.length === 1 ? nouns[0] : nouns[1]) + (isAll ? " found" : "");

  document.getElementById("allCount").textContent = JOBS.length;
  document.getElementById("savedCount").textContent = session ? savedJobsList().length : 0;
  document.getElementById("referralCount").textContent = session ? myReferrals().length : 0;

  if (list.length === 0) setEmpty();
}

function toggleSave(job) {
  const saved = loadSavedJobs();
  const index = saved.findIndex((s) =>
    s.jobId === job.id && s.userId === session.id && s.role === session.role
  );

  if (index === -1) {
    saved.push({
      jobId: job.id,
      userId: session.id,
      role: session.role,
      createdAt: new Date().toISOString()
    });
    showToast("Job saved.");
  } else {
    saved.splice(index, 1);
    showToast("Removed from saved jobs.");
  }

  saveSavedJobs(saved);
  render();
}

function withdrawReferral(job) {
  if (!confirm("Withdraw your referral request for this job?")) return;

  saveReferrals(loadReferrals().filter((r) =>
    !(r.jobId === job.id && r.userId === session.id && r.role === session.role)
  ));

  showToast("Referral request withdrawn.");
  render();
}

function setReferError(message) {
  referMessage.closest(".form-field").classList.toggle("invalid", message !== "");
  referError.textContent = message;
}

function openRefer(job) {
  if (session.role !== "student") return;

  const poster = MENTORS.find((m) => m.id === job.posterId);

  referJob = job;
  referJobLine.textContent = job.title + " at " + job.company +
    (poster ? ", posted by " + poster.name : "");
  referMessage.value = "";
  referCounter.textContent = "0 / " + referMessage.maxLength;
  setReferError("");
  referDialog.showModal();
}

jobGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const job = jobsById[button.dataset.id];
  if (!job) return;

  const action = button.dataset.action;

  if (action === "save") toggleSave(job);
  else if (action === "refer") openRefer(job);
  else if (action === "withdraw") withdrawReferral(job);
});

referMessage.addEventListener("input", () => {
  setReferError("");
  referCounter.textContent = referMessage.value.length + " / " + referMessage.maxLength;
});

referForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = referMessage.value.trim();

  if (text.length < MIN_REFERRAL) {
    setReferError("Please write at least " + MIN_REFERRAL + " characters about why you are a good fit.");
    return;
  }

  if (!referJob || referralFor(referJob.id)) {
    referDialog.close();
    return;
  }

  const poster = MENTORS.find((m) => m.id === referJob.posterId);
  const list = loadReferrals();

  list.push({
    id: "f" + Date.now(),
    jobId: referJob.id,
    jobTitle: referJob.title,
    company: referJob.company,
    posterId: referJob.posterId,
    posterName: poster ? poster.name : "Alumnus",
    userId: session.id,
    role: session.role,
    name: session.name,
    message: text,
    status: "Pending",
    createdAt: new Date().toISOString()
  });

  saveReferrals(list);
  referDialog.close();
  showToast("Referral request sent for " + referJob.title + ".");
  render();
});

document.getElementById("referCancel").addEventListener("click", () => referDialog.close());

referDialog.addEventListener("click", (event) => {
  if (event.target === referDialog) referDialog.close();
});

jobTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentView = tab.dataset.view;

    jobTabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-pressed", String(active));
    });

    render();
  });
});

searchInput.addEventListener("input", render);

[typeFilter, locationFilter, modeFilter].forEach((control) => {
  control.addEventListener("change", render);
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  typeFilter.value = "";
  locationFilter.value = "";
  modeFilter.value = "";
  render();
});

fillSelect(typeFilter, uniqueSorted("type"));
fillSelect(locationFilter, uniqueSorted("location"));
fillSelect(modeFilter, uniqueSorted("mode"));

render();