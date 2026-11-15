const CAREER_PATHS = [
  {
    id: "software",
    label: "Software and IT",
    icon: "bi-code-slash",
    summary: "Build, test and run software products, from web apps to cloud systems and data platforms.",
    roles: ["Software Engineer", "Web Developer", "Data Analyst", "Machine Learning Engineer", "DevOps Engineer"],
    skills: ["Data structures and algorithms", "One strong language (Java, Python or C++)", "Databases and SQL", "Git and GitHub", "Cloud basics"],
    mentorBranch: "CSE",
    mentorTopic: null,
    steps: [
      { when: "Early years", title: "Learn the basics", text: "Pick one language and practise problem solving regularly. Learn Git and build small projects." },
      { when: "Middle years", title: "Build real projects", text: "Make two or three projects you can explain and put them on GitHub. Try a hackathon or an open-source contribution." },
      { when: "Final year", title: "Prepare for placements", text: "Revise data structures, practise coding problems and mock interviews, and tailor your resume to each role." },
      { when: "After graduation", title: "Keep growing", text: "Learn system design and cloud tools on the job, and keep a learning plan for your next role." }
    ]
  },
  {
    id: "electronics",
    label: "Electronics and Embedded",
    icon: "bi-cpu",
    summary: "Design and test the hardware and firmware inside devices, from sensors and microcontrollers to chips and communication systems.",
    roles: ["Embedded Engineer", "VLSI Design Engineer", "Design Verification Engineer", "IoT Engineer", "Test Engineer"],
    skills: ["Digital and analog electronics", "C and embedded programming", "Verilog or VHDL", "Microcontrollers such as ESP32 or Arduino", "Circuit and PCB design tools"],
    mentorBranch: "ECE",
    mentorTopic: null,
    steps: [
      { when: "Early years", title: "Master the fundamentals", text: "Get comfortable with circuits, diodes, transistors and logic gates in your lab work, and learn C programming." },
      { when: "Middle years", title: "Build hardware projects", text: "Build projects with microcontrollers and sensors, and document them with circuit diagrams and code on GitHub." },
      { when: "Final year", title: "Choose a direction", text: "Decide between embedded, VLSI or communication, then focus your project, internships and interview practice on it. Look at GATE if you plan higher studies." },
      { when: "After graduation", title: "Specialise", text: "Learn the industry tools on the job, and consider certifications or a master's degree in your chosen area." }
    ]
  },
  {
    id: "mechanical",
    label: "Mechanical Engineering",
    icon: "bi-gear",
    summary: "Design, manufacture and maintain machines and systems, in fields such as automotive, energy and manufacturing.",
    roles: ["Design Engineer", "Manufacturing Engineer", "Quality Engineer", "Maintenance Engineer", "Project Engineer"],
    skills: ["CAD tools such as AutoCAD or SolidWorks", "Mechanics and thermodynamics fundamentals", "Manufacturing processes", "Simulation tools such as ANSYS", "Project management basics"],
    mentorBranch: "Mechanical",
    mentorTopic: null,
    steps: [
      { when: "Early years", title: "Learn the core subjects", text: "Build a strong base in mechanics, thermodynamics and engineering drawing, and start learning a CAD tool." },
      { when: "Middle years", title: "Get hands-on", text: "Join a student team such as a vehicle or robotics team, and do a workshop or plant-based internship." },
      { when: "Final year", title: "Aim at your sector", text: "Choose a sector such as automotive or manufacturing, build a design project, and prepare for core company recruitment." },
      { when: "After graduation", title: "Grow in the field", text: "Learn simulation and project tools at work, and consider a management or master's degree later." }
    ]
  },
  {
    id: "civil",
    label: "Civil Engineering",
    icon: "bi-bricks",
    summary: "Plan, design and build structures such as buildings, roads and bridges, and manage the projects that deliver them.",
    roles: ["Site Engineer", "Structural Engineer", "Planning Engineer", "Quantity Surveyor", "Project Manager"],
    skills: ["AutoCAD and a structural design tool", "Estimation and costing", "Surveying", "Construction management", "Knowledge of building codes"],
    mentorBranch: "Civil",
    mentorTopic: null,
    steps: [
      { when: "Early years", title: "Learn the fundamentals", text: "Focus on structures, materials and surveying, and learn AutoCAD." },
      { when: "Middle years", title: "See real sites", text: "Do site visits and a construction internship to see how projects actually run." },
      { when: "Final year", title: "Choose your route", text: "Decide between site, design or planning roles, and prepare for recruitment in your chosen route." },
      { when: "After graduation", title: "Build experience", text: "Gain site experience first, then consider a master's degree or a professional certification." }
    ]
  },
  {
    id: "management",
    label: "Management and MBA",
    icon: "bi-graph-up-arrow",
    summary: "Work on business problems in consulting, analytics, marketing, finance or operations.",
    roles: ["Business Analyst", "Management Consultant", "Marketing Executive", "Financial Analyst", "Operations Manager"],
    skills: ["Excel and data analysis", "SQL basics", "Business communication", "Case study thinking", "Presentation skills"],
    mentorBranch: "MBA",
    mentorTopic: null,
    steps: [
      { when: "Early years", title: "Build the foundation", text: "Learn accounting, marketing and economics basics, and sharpen your Excel skills." },
      { when: "Middle years", title: "Choose a specialisation", text: "Pick finance, marketing, HR or analytics, and do a summer internship in that area." },
      { when: "Final year", title: "Prepare for placements", text: "Practise case interviews and group discussions, and keep a strong resume with your internship results." },
      { when: "After graduation", title: "Move up", text: "Build domain expertise, grow your network, and add certifications that suit your role." }
    ]
  },
  {
    id: "higher",
    label: "Higher Studies",
    icon: "bi-mortarboard",
    summary: "Continue with a master's or a PhD in India or abroad, or move into research.",
    roles: ["Master's student", "Research scholar", "Teaching assistant", "Researcher"],
    skills: ["Strong subject fundamentals", "Research or project experience", "Academic writing", "Entrance exam preparation", "Statement of purpose writing"],
    mentorBranch: null,
    mentorTopic: "higher studies",
    steps: [
      { when: "Early years", title: "Keep your fundamentals strong", text: "Focus on your core subjects and look for a professor or lab you can work with." },
      { when: "Middle years", title: "Start research", text: "Work on a research-style project, and find out which exams your target programmes need, such as GATE, GRE or CAT, and whether an English test is required abroad." },
      { when: "Final year", title: "Apply", text: "Prepare your documents and statement of purpose, ask for recommendation letters early, and check official deadlines and eligibility." },
      { when: "Once admitted", title: "Plan the move", text: "Plan funding, accommodation and, if going abroad, your visa, and stay in touch with a mentor." }
    ]
  }
];

const RESUME_GROUPS = [
  {
    title: "Basics",
    items: [
      { id: "r1", text: "Your name, phone, email and a LinkedIn or GitHub link are at the top" },
      { id: "r2", text: "You use a professional email address" },
      { id: "r3", text: "A short summary of two lines at most, written for the role" }
    ]
  },
  {
    title: "Projects and skills",
    items: [
      { id: "r4", text: "Two or three projects, each with what you built, the tools used and the result" },
      { id: "r5", text: "Skills are grouped by type, listing only what you can discuss in an interview" },
      { id: "r6", text: "Links to your GitHub or portfolio work" }
    ]
  },
  {
    title: "Experience and achievements",
    items: [
      { id: "r7", text: "Internships and training with your role and what you achieved" },
      { id: "r8", text: "Certifications, competitions or achievements that fit the role" },
      { id: "r9", text: "Each bullet point starts with an action verb" }
    ]
  },
  {
    title: "Final checks",
    items: [
      { id: "r10", text: "One page, unless you have a lot of relevant experience" },
      { id: "r11", text: "No spelling or grammar errors, and you have read it aloud once" },
      { id: "r12", text: "Consistent fonts, spacing and date format" },
      { id: "r13", text: "Saved as a PDF with a clear file name, such as Name_Role.pdf" },
      { id: "r14", text: "Reviewed by a friend or a mentor" }
    ]
  }
];

const QA_GROUPS = [
  {
    title: "HR and behavioural",
    icon: "bi-person-lines-fill",
    items: [
      { q: "Tell me about yourself.", tip: "Answer in three parts: who you are, what you have done so far (studies and projects), and what you want next. Keep it under two minutes and relevant to the role." },
      { q: "Why do you want to join this company?", tip: "Read about the company and its products before the interview. Link one or two specifics to your own skills and goals instead of giving a general answer." },
      { q: "Tell me about a time you faced a difficult situation.", tip: "Use the STAR method. Describe the situation and task briefly, then spend most of your time on the action you took and the result." }
    ]
  },
  {
    title: "Technical",
    icon: "bi-code-square",
    items: [
      { q: "Explain a concept from your core subject in simple words.", tip: "Start with a one-line definition, then give an example. Practise explaining the main topics of your branch to a friend from another branch." },
      { q: "How would you approach a problem you have never seen before?", tip: "Think aloud. Restate the problem, ask clarifying questions, start with a simple solution and then improve it. Interviewers value your reasoning as much as the final answer." },
      { q: "What would you do if you did not know the answer?", tip: "Say honestly what you do know, explain how you would find out the rest, and avoid guessing with false confidence. An honest answer with a clear approach beats a wrong one." }
    ]
  },
  {
    title: "Projects and resume",
    icon: "bi-folder2-open",
    items: [
      { q: "Walk me through your best project.", tip: "Cover the problem, your role, the tools you chose and why, one challenge you solved, and the result. Be ready for follow-up questions on any line of your resume." },
      { q: "What was the hardest part of the project, and how did you solve it?", tip: "Pick a real, specific problem and explain how you researched or debugged it. This shows how you learn." },
      { q: "What would you improve if you had more time?", tip: "Name one or two realistic improvements, such as better testing, a cleaner design or an extra feature, and explain why they matter." }
    ]
  }
];