const EVENTS = [
  { id: "e1", title: "Cracking Campus Placements", type: "Webinar", mode: "Online",
    place: "Link shared after registration", daysFromNow: 3, hour: 18, minute: 0, minutes: 60,
    speakerId: "m1", description: "Learn how to plan your preparation, from coding practice to interview rounds." },
  { id: "e2", title: "Getting Started with VLSI Careers", type: "Talk", mode: "Online",
    place: "Link shared after registration", daysFromNow: 6, hour: 17, minute: 30, minutes: 60,
    speakerId: "m2", description: "An introduction to chip design roles and the skills that help you get there." },
  { id: "e3", title: "Machine Learning: First Project to First Job", type: "Workshop", mode: "On campus",
    place: "Campus seminar hall", daysFromNow: 9, hour: 11, minute: 0, minutes: 120,
    speakerId: "m4", description: "A hands-on session on building a first ML project that you can show to recruiters." },
  { id: "e4", title: "Resume Review Clinic", type: "Workshop", mode: "Online",
    place: "Link shared after registration", daysFromNow: 12, hour: 19, minute: 0, minutes: 90,
    speakerId: "m6", description: "Bring your resume and get practical feedback on structure, wording and projects." },
  { id: "e5", title: "Alumni Networking Evening", type: "Networking", mode: "On campus",
    place: "Campus auditorium", daysFromNow: 16, hour: 17, minute: 0, minutes: 120,
    speakerId: null, description: "Meet alumni from different fields in an informal setting and ask your questions." },
  { id: "e6", title: "Web Development Portfolio Workshop", type: "Workshop", mode: "Online",
    place: "Link shared after registration", daysFromNow: 20, hour: 16, minute: 0, minutes: 120,
    speakerId: "m10", description: "Plan and publish a portfolio site that shows your projects clearly." },
  { id: "e7", title: "Intro to Embedded Systems Careers", type: "Talk", mode: "Online",
    place: "Recorded session", daysFromNow: -5, hour: 18, minute: 0, minutes: 60,
    speakerId: "m7", description: "A look at embedded roles in industry and how to start with microcontroller projects." },
  { id: "e8", title: "Interview Skills Bootcamp", type: "Workshop", mode: "On campus",
    place: "Campus seminar hall", daysFromNow: -12, hour: 10, minute: 0, minutes: 180,
    speakerId: "m3", description: "Mock interviews and feedback on communication and problem solving." }
];

function eventDate(daysFromNow, hour, minute) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function getEvents() {
  return EVENTS.map((e) => {
    const start = eventDate(e.daysFromNow, e.hour, e.minute);
    const end = new Date(start.getTime() + e.minutes * 60000);
    return { ...e, start, end };
  });
}

function eventState(ev, now = new Date()) {
  if (now < ev.start) return "upcoming";
  if (now < ev.end) return "live";
  return "past";
}

function formatWhen(ev) {
  const day = ev.start.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const time = { hour: "numeric", minute: "2-digit", hour12: true };
  return day + ", " + ev.start.toLocaleTimeString("en-IN", time) +
    " to " + ev.end.toLocaleTimeString("en-IN", time);
}

function loadRegs() {
  try {
    const saved = JSON.parse(localStorage.getItem("lpu_event_regs"));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function saveRegs(list) {
  localStorage.setItem("lpu_event_regs", JSON.stringify(list));
}

function isRegistered(eventId) {
  return Boolean(session) && loadRegs().some((r) =>
    r.eventId === eventId && r.userId === session.id && r.role === session.role
  );
}