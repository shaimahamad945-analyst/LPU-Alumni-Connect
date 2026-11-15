const JOBS = [
  { id: "j1", title: "Software Engineering Intern", company: "Microsoft", type: "Internship",
    location: "Hyderabad", mode: "Hybrid", posterId: "m1", daysAgo: 2,
    eligibility: "Pre-final year, CSE and related branches",
    skills: ["Java", "Data Structures", "Problem Solving"],
    description: "Work with a small team on cloud service features and learn how production code is reviewed and shipped." },
  { id: "j2", title: "Design Engineer Trainee (VLSI)", company: "Qualcomm", type: "Full-time",
    location: "Bengaluru", mode: "On-site", posterId: "m2", daysAgo: 3,
    eligibility: "Final year or recent graduates, ECE",
    skills: ["Verilog", "Digital Design", "C"],
    description: "Join a chip design team and learn the flow from specification to verification." },
  { id: "j3", title: "Backend Developer", company: "Amazon", type: "Full-time",
    location: "Bengaluru", mode: "On-site", posterId: "m3", daysAgo: 5,
    eligibility: "Recent graduates, CSE and IT",
    skills: ["Python", "AWS", "Algorithms"],
    description: "Build and maintain services that handle large volumes of requests, with code reviews from senior engineers." },
  { id: "j4", title: "Machine Learning Intern", company: "Google", type: "Internship",
    location: "Hyderabad", mode: "Hybrid", posterId: "m4", daysAgo: 1,
    eligibility: "Pre-final or final year, CSE with ML projects",
    skills: ["Python", "Machine Learning", "Statistics"],
    description: "Support an applied ML team with data preparation, experiments and evaluation of models." },
  { id: "j5", title: "Graduate Engineer Trainee", company: "Tata Motors", type: "Full-time",
    location: "Pune", mode: "On-site", posterId: "m5", daysAgo: 7,
    eligibility: "Final year, Mechanical",
    skills: ["CAD", "Manufacturing", "Project Management"],
    description: "Rotate through product development and manufacturing teams during the first year." },
  { id: "j6", title: "Business Analyst Intern", company: "Deloitte", type: "Internship",
    location: "Gurugram", mode: "Hybrid", posterId: "m6", daysAgo: 4,
    eligibility: "MBA first year",
    skills: ["Excel", "Business Analysis", "Presentation"],
    description: "Assist a consulting team with market research, data analysis and client presentations." },
  { id: "j7", title: "Applications Engineer Trainee", company: "Texas Instruments", type: "Full-time",
    location: "Bengaluru", mode: "On-site", posterId: "m7", daysAgo: 9,
    eligibility: "Final year or recent graduates, ECE",
    skills: ["Analog Design", "Embedded C", "PCB Design"],
    description: "Help customers use analog and power products, from reading datasheets to debugging boards." },
  { id: "j8", title: "Data Analyst Intern", company: "Flipkart", type: "Internship",
    location: "Bengaluru", mode: "Remote", posterId: "m8", daysAgo: 6,
    eligibility: "Any branch, comfortable with SQL",
    skills: ["SQL", "Excel", "Dashboards"],
    description: "Build dashboards and answer business questions from sales and customer data." },
  { id: "j9", title: "Frontend Developer Intern", company: "Adobe", type: "Internship",
    location: "Noida", mode: "Remote", posterId: "m10", daysAgo: 2,
    eligibility: "Pre-final year, CSE with web projects",
    skills: ["JavaScript", "React", "UI Design"],
    description: "Work on user interface features and learn how design and engineering teams collaborate." },
  { id: "j10", title: "Validation Engineer Trainee", company: "Intel", type: "Full-time",
    location: "Bengaluru", mode: "On-site", posterId: "m12", daysAgo: 11,
    eligibility: "Final year or recent graduates, ECE",
    skills: ["SystemVerilog", "Python", "Digital Design"],
    description: "Write tests and checkers that confirm a chip behaves as designed before it is manufactured." },
  { id: "j11", title: "Site Engineer Trainee", company: "L&T Construction", type: "Full-time",
    location: "Chennai", mode: "On-site", posterId: "m9", daysAgo: 8,
    eligibility: "Final year, Civil",
    skills: ["AutoCAD", "Estimation", "Site Management"],
    description: "Learn site planning, quantity estimation and quality checks on a live construction project." },
  { id: "j12", title: "Technology Analyst Trainee", company: "Infosys", type: "Full-time",
    location: "Pune", mode: "Hybrid", posterId: "m11", daysAgo: 10,
    eligibility: "Recent graduates, CSE and IT",
    skills: ["Java", "Spring Boot", "Agile"],
    description: "Start in a delivery team, with training on the tools and processes used on client projects." }
];

function postedText(daysAgo) {
  if (daysAgo === 0) return "Posted today";
  if (daysAgo === 1) return "Posted yesterday";
  return "Posted " + daysAgo + " days ago";
}

function loadSavedJobs() {
  try {
    const saved = JSON.parse(localStorage.getItem("lpu_saved_jobs"));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function saveSavedJobs(list) {
  localStorage.setItem("lpu_saved_jobs", JSON.stringify(list));
}

function isJobSaved(jobId) {
  return Boolean(session) && loadSavedJobs().some((s) =>
    s.jobId === jobId && s.userId === session.id && s.role === session.role
  );
}

function loadReferrals() {
  try {
    const saved = JSON.parse(localStorage.getItem("lpu_referrals"));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function saveReferrals(list) {
  localStorage.setItem("lpu_referrals", JSON.stringify(list));
}

function referralFor(jobId) {
  if (!session) return undefined;
  return loadReferrals().find((r) =>
    r.jobId === jobId && r.userId === session.id && r.role === session.role
  );
}