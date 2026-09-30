/* =====================================================================
   DATA.JS — every piece of content on the site lives here.
   Edit this file to make the portfolio yours. No build step needed.
   ===================================================================== */

window.DATA = {
  player: {
    name: "Akshat Parashar",
    callsign: "AKSHAT",
    tag: "#AI26",
    title: "AI Engineer",
    tagline: "Software · Full-Stack · UI/UX · AI",
    location: "Jaipur, Rajasthan",
    level: 26,                          // number shown on the player card badge
    email: "akshatparashar4704@gmail.com",
    phone: "+91-7240716881",
    resume: "https://drive.google.com/file/d/1BkL_vgbHshUp0XGoYss1QzYNgMiGI6hy/view?usp=sharing",
    summary:
      "Computer Science B.Tech graduate and full-stack / AI developer with hands-on experience building web applications, AI-integrated tools and SaaS products. Skilled in React.js, Node.js, Python and the Gemini API, with a strong focus on shipping real-world projects end-to-end.",
    hype:
      "On the biggest stage of the stack, it all comes down to a single deploy. The heartbeat between a bug and a breakthrough. Design or die. Join Akshat in Jaipur, where LLMs, pixels and pipelines collide — and every project is played to win.",
    bio:
      "Jaipur-born Agent Akshat bends LLMs, pixels and pipelines to reshape products at will. With full command of the stack and a talent for design foresight, Akshat is always a commit ahead of the next bug.",
    languages: ["English", "Hindi"],
    interests: "Loves building AI-integrated and UI SaaS products, playing games and learning new AI tools."
  },

  socials: [
    { id: "github",    label: "GitHub",    url: "https://github.com/akshatparashar" },
    { id: "linkedin",  label: "LinkedIn",  url: "https://www.linkedin.com/in/akshat-parashar-13x" },
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/akshat_parashar.007/" }
  ],

  /* top-bar "currencies" */
  stats: [
    { icon: "proj", value: "08", label: "Projects shipped" },
    { icon: "role", value: "04", label: "Roles played" },
    { icon: "cgpa", value: "8.6", label: "B.Tech CGPA" }
  ],

  /* ---------------- EXPERIENCE (Career / Progression) ---------------- */
  experience: [
    {
      id: "flo", org: "FLO", abbr: "FLO", role: "AI Engineer",
      start: "2026-05", end: null, dates: "May 2026 – Present", type: "work", result: "live",
      color: "#2ee6b6",
      points: [
        "Developed AI-powered solutions using modern AI tools, Large Language Models (LLMs) and prompt engineering techniques.",
        "Designed, optimized and automated intelligent workflows to improve efficiency and AI application performance.",
        "Researched and implemented emerging AI technologies to build AI-driven applications and enhance business processes through AI automation."
      ],
      stack: ["LLMs", "Prompt Eng.", "Automation", "Gemini", "Groq"]
    },
    {
      id: "celebal", org: "Celebal Technologies", abbr: "CLB", role: "DevOps Intern",
      start: "2025-06", end: "2025-08", dates: "Jun 2025 – Aug 2025", type: "work", result: "victory",
      color: "#4cc3ff",
      points: [
        "Completed an intensive 60-day hands-on DevOps program covering Linux, Git, GitHub, Docker, Jenkins, Kubernetes and AWS.",
        "Gained practical experience building and managing CI/CD pipelines and automating deployment workflows.",
        "Built a strong foundation in containerization, version control, cloud services and modern DevOps practices."
      ],
      stack: ["Linux", "Docker", "Jenkins", "Kubernetes", "AWS"]
    },
    {
      id: "greymoon", org: "GreyMoon", abbr: "GMN", role: "UI/UX Designer",
      start: "2024-06", end: "2024-07", dates: "Jun 2024 – Jul 2024", type: "work", result: "victory",
      color: "#b18cff",
      points: [
        "GreyMoon — a creative tech company specialising in web solutions.",
        "Worked as UI Designer & Frontend Developer: designed intuitive interfaces and UX flows in Figma.",
        "Built responsive, user-friendly websites from those designs."
      ],
      stack: ["Figma", "UI/UX", "Frontend", "Responsive"]
    },
    {
      id: "internpay", org: "InternPay", abbr: "INP", role: "Web Designer",
      start: "2023-06", end: "2023-08", dates: "Jun 2023 – Aug 2023", type: "work", result: "victory",
      color: "#ffb454",
      points: [
        "Designed, developed and maintained responsive web applications using front-end and back-end technologies.",
        "Worked with JavaScript, Node.js, Figma and modern AI tools to build and enhance web solutions.",
        "Collaborated on user-centric digital experiences focused on functionality, performance and UI/UX."
      ],
      stack: ["JavaScript", "Node.js", "Figma", "AI tools"]
    }
  ],

  education: [
    {
      id: "poornima", org: "Poornima College of Engineering, Jaipur", abbr: "PCE",
      role: "B.Tech — Computer Science & Engineering", dates: "2022 – 2026", start: "2022-08", end: "2026-06",
      type: "edu", result: "graduated", score: "CGPA 8.6", color: "#e8c56d",
      points: ["Four-year B.Tech in CSE, graduated 2026 with a CGPA of 8.6."]
    },
    {
      id: "happy", org: "Happy Public Sr. Sec. School, Alwar", abbr: "HPS",
      role: "Class XII — PCM", dates: "2021 – 2022", start: "2021-04", end: "2022-03",
      type: "edu", result: "cleared", score: "93.4%", color: "#e8c56d",
      points: ["Physics, Chemistry & Mathematics — scored 93.4%."]
    }
  ],

  certifications: [
    { name: "DevOps Certificate", by: "Celebal Technologies", year: "2025", icon: "shield" },
    { name: "AI Tools & Tech Certificate", by: "Certification", year: "", icon: "spark" },
    { name: "UI/UX Certificate", by: "Certification", year: "", icon: "pen" },
    { name: "Class XII — 93.4%", by: "Happy Public Sr. Sec. School", year: "2022", icon: "star" },
    { name: "B.Tech CSE — CGPA 8.6", by: "Poornima College of Engineering", year: "2026", icon: "cap" }
  ],

  /* ---------------- PROJECTS (Collection = weapon loadout) ---------------- */
  loadout: [
    { slot: "RIFLES", sub: "AI Products", ids: ["resume", "dsa"] },
    { slot: "SNIPERS", sub: "Production Sites", ids: ["vishvora", "tunes"] },
    { slot: "SIDEARMS", sub: "Experiments & Builds", ids: ["a54", "gesture", "animated"] },
    { slot: "MELEE", sub: "Close range", ids: ["portfolio"] }
  ],

  projects: {
    resume: {
      name: "AI Resume Analyzer", weapon: "VANDAL", tier: "ultra",
      img: "assets/img/resume-bolt.webp", alt: "assets/img/ai-resume.webp",
      desc: "AI-powered Resume Analyzer and Career Mentor platform with ATS scoring, job matching and personalised career recommendations using real-time resume analysis and LLM integration.",
      stack: ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB", "Groq AI"],
      live: "https://resume-bolt.vercel.app/", code: "https://github.com/akshatparashar/resume-frontend"
    },
    dsa: {
      name: "DSA Mentor AI", weapon: "PHANTOM", tier: "premium",
      img: "assets/img/dsa-teacher.webp",
      desc: "Full-stack learning platform that uses Gemini AI to explain DSA code, analyse complexity and provide interactive algorithm visualisations, personalised roadmaps, progress tracking and gamified coding through an integrated IDE and analytics dashboard.",
      stack: ["Node.js", "MongoDB", "JavaScript", "Gemini API"],
      live: "https://dsa-teacher.vercel.app/", code: "https://github.com/akshatparashar/DSA_TEACHER"
    },
    vishvora: {
      name: "Vishvora.com", weapon: "OPERATOR", tier: "exclusive",
      img: "assets/img/vishvora.webp",
      desc: "Built and deployed a responsive travel platform for VISHVORA — destination discovery, curated international packages, inquiry workflows and a polished experience for private travel planning.",
      stack: ["Web", "Responsive UI", "Inquiry flows", "Deployment"],
      live: "https://www.vishvora.com/"
    },
    tunes: {
      name: "TunesofDunes.com", weapon: "MARSHAL", tier: "exclusive",
      img: "assets/img/tunesofdunes.webp",
      desc: "Production travel website for Rajasthan tourism — curated tour packages, destination experiences, hotel and taxi services, inquiry and booking flows, WhatsApp integration and a responsive UI.",
      stack: ["Web", "Booking flows", "WhatsApp API", "Responsive UI"],
      live: "https://tunesofdunes.com/"
    },
    a54: {
      name: "A54 Pocket Server", weapon: "SHERIFF", tier: "deluxe",
      art: "phone",
      desc: "Configured an Oppo A54 as a portable self-hosted server for running and accessing web services — exploring mobile server deployment, networking, remote access and low-cost infrastructure.",
      stack: ["Linux", "Networking", "Self-hosting", "Shell"],
      code: "https://github.com/akshatparashar/A54-PocketLab"
    },
    gesture: {
      name: "Hand Gesture Recognition", weapon: "GHOST", tier: "premium",
      img: "assets/img/hand-gesture.webp",
      desc: "A computer-vision system that reads hand gestures in real time using classical machine learning.",
      stack: ["Python", "OpenCV", "Machine Learning", "Computer Vision"],
      code: "https://github.com/akshatparashar/HAND_GESTURE"
    },
    animated: {
      name: "Animated Product Website", weapon: "CLASSIC", tier: "select",
      img: "assets/img/animated-site.webp",
      desc: "A product website built around motion — an enhanced, interactive experience that guides people through the product.",
      stack: ["HTML", "CSS", "JavaScript", "Motion"],
      live: "https://animated-website-dun.vercel.app/", code: "https://github.com/akshatparashar/animated_website"
    },
    portfolio: {
      name: "This Portfolio", weapon: "KNIFE", tier: "ultra",
      art: "client",
      desc: "The site you're on — a fan-made, game-client inspired portfolio. Vanilla HTML/CSS/JS, synthesised UI sounds, crosshair cursor, a matchmaking queue for recruiters and zero frameworks.",
      stack: ["HTML", "CSS", "JavaScript", "Web Audio", "Canvas"],
      live: "https://akshatparashar.vercel.app/"
    }
  },

  /* ---------------- SKILLS (Agents) ---------------- */
  roles: {
    lang:   { name: "Languages", role: "DUELIST",    color: "#ff5a5f", bg: ["#2a0d18", "#6d1730"], desc: "Duelists are first through the door — the languages that make things happen." },
    web:    { name: "Web",       role: "INITIATOR",  color: "#35d0ba", bg: ["#061f26", "#0f4d57"], desc: "Initiators open up the map — frameworks and APIs that get the whole team moving." },
    ai:     { name: "AI / ML",   role: "CONTROLLER", color: "#c77dff", bg: ["#170a33", "#4b1c9a"], desc: "Controllers bend the battlefield — models and prompts shaped to control the outcome." },
    devops: { name: "DevOps",    role: "SENTINEL",   color: "#8be04e", bg: ["#0b1d10", "#1f5227"], desc: "Sentinels lock down the site — pipelines, containers and clouds that keep prod alive." },
    design: { name: "Design",    role: "VISIONARY",  color: "#ffc857", bg: ["#241604", "#7a4a0c"], desc: "Visionaries make it feel as good as it works — interfaces people actually enjoy." }
  },

  /* mastery: 1-5 — self-assessed, tweak freely */
  skills: [
    { id: "python", name: "Python", role: "lang", icon: "python/python-original", m: 4, desc: "Scripting, ML experiments, OpenCV and backend glue." },
    { id: "javascript", name: "JavaScript", role: "lang", icon: "javascript/javascript-original", m: 5, desc: "The daily driver — front to back, browser to server." },
    { id: "typescript", name: "TypeScript", role: "lang", icon: "typescript/typescript-original", m: 3, desc: "Types for when projects grow up." },
    { id: "cpp", name: "C++", role: "lang", icon: "cplusplus/cplusplus-original", m: 3, desc: "Data structures, algorithms and competitive fundamentals." },
    { id: "html", name: "HTML", role: "lang", icon: "html5/html5-original", m: 5, desc: "Semantic structure for every interface shipped." },
    { id: "css", name: "CSS", role: "lang", icon: "css3/css3-original", m: 5, desc: "Layouts, motion and pixel-level polish (like this site)." },

    { id: "react", name: "React.js", role: "web", icon: "react/react-original", m: 4, desc: "Component-driven UIs and SaaS dashboards." },
    { id: "node", name: "Node.js", role: "web", icon: "nodejs/nodejs-original", m: 4, desc: "APIs and servers behind the AI tools." },
    { id: "express", name: "Express.js", role: "web", icon: "express/express-original", m: 4, desc: "Lean REST APIs, fast." },
    { id: "rest", name: "REST APIs", role: "web", glyph: "{ }", m: 4, desc: "Designing and consuming clean HTTP interfaces." },
    { id: "postman", name: "Postman", role: "web", icon: "postman/postman-original", m: 4, desc: "Testing and documenting APIs." },
    { id: "mongodb", name: "MongoDB", role: "web", icon: "mongodb/mongodb-original", m: 4, desc: "Clusters powering the resume analyser and DSA mentor." },
    { id: "sql", name: "SQL", role: "web", icon: "azuresqldatabase/azuresqldatabase-original", m: 2, desc: "Relational basics and queries." },

    { id: "gemini", name: "Gemini API", role: "ai", glyph: "✦", m: 4, desc: "Explaining code and analysing complexity inside DSA Mentor AI." },
    { id: "groq", name: "Groq API", role: "ai", glyph: "GQ", m: 4, desc: "Blazing-fast LLM inference for the resume analyser." },
    { id: "prompt", name: "Prompt Engineering", role: "ai", glyph: "›_", m: 5, desc: "Getting reliable, structured output out of LLMs." },
    { id: "aistudio", name: "Google AI Studio", role: "ai", glyph: "AI", m: 4, desc: "Prototyping prompts and model behaviour." },
    { id: "llm", name: "LLM Workflows", role: "ai", glyph: "∞", m: 4, desc: "Automated intelligent workflows at FLO." },
    { id: "opencv", name: "OpenCV", role: "ai", icon: "opencv/opencv-original", m: 3, desc: "Real-time hand gesture recognition." },

    { id: "git", name: "Git / GitHub", role: "devops", icon: "git/git-original", m: 4, desc: "Version control for everything." },
    { id: "docker", name: "Docker", role: "devops", icon: "docker/docker-original", m: 3, desc: "Containerisation from the Celebal DevOps program." },
    { id: "jenkins", name: "Jenkins", role: "devops", icon: "jenkins/jenkins-original", m: 3, desc: "CI/CD pipelines and automated deploys." },
    { id: "k8s", name: "Kubernetes", role: "devops", icon: "kubernetes/kubernetes-original", m: 2, desc: "Orchestration fundamentals." },
    { id: "aws", name: "AWS", role: "devops", icon: "amazonwebservices/amazonwebservices-plain-wordmark", m: 2, desc: "Cloud services basics." },
    { id: "azure", name: "Azure", role: "devops", icon: "azure/azure-original", m: 2, desc: "Cloud platform work." },
    { id: "linux", name: "Linux / Shell", role: "devops", icon: "linux/linux-original", m: 4, desc: "Shell scripting — even on a phone turned server." },
    { id: "vercel", name: "Vercel / Netlify", role: "devops", icon: "vercel/vercel-original", m: 5, desc: "Where every project goes live." },

    { id: "figma", name: "Figma", role: "design", icon: "figma/figma-original", m: 5, desc: "Wireframes to polished UI systems." },
    { id: "uiux", name: "UI/UX Design", role: "design", glyph: "UX", m: 5, desc: "User-first interfaces, research to hand-off." },
    { id: "framer", name: "Framer Motion", role: "design", icon: "framermotion/framermotion-original", m: 3, desc: "Motion that makes interfaces feel alive." },
    { id: "canva", name: "Canva", role: "design", icon: "canva/canva-original", m: 4, desc: "Fast visual content." }
  ],

  /* Career-page "agent mastery" (top roles) */
  mains: [
    { name: "AI ENGINEER", lvl: 4, role: "ai" },
    { name: "FULL-STACK", lvl: 4, role: "web" },
    { name: "UI / UX", lvl: 5, role: "design" }
  ],

  /* Progression page */
  dailyLoop: ["PROMPT", "BUILD", "AUTOMATE", "SHIP"],
  grind: [
    { name: "Ship AI workflows at FLO", reward: "+ IMPACT" },
    { name: "Level up LLM agents & RAG", reward: "+ XP" },
    { name: "Launch the next AI SaaS", reward: "+ USERS" }
  ],

  /* Store (services) */
  services: [
    { name: "AI Integration", tier: "select", icon: "spark", desc: "LLMs (Gemini, Groq), prompt pipelines and AI automation dropped into your product." },
    { name: "Full-Stack Web App", tier: "exclusive", icon: "stack", desc: "React/Node/MongoDB apps, from schema to deploy." },
    { name: "UI/UX Design", tier: "exclusive", icon: "pen", desc: "Figma-first interfaces that people enjoy using." },
    { name: "Deploy & DevOps", tier: "premium", icon: "rocket", desc: "CI/CD, Docker and cloud hosting so it stays live." }
  ],

  /* Night market — flip to reveal */
  nightMarket: [
    { off: 31, title: "POCKET SERVER", fact: "Turned an Oppo A54 into a self-hosted web server." },
    { off: 43, title: "CLASS XII", fact: "Scored 93.4% in PCM." },
    { off: 45, title: "MAIN GAME", fact: "Plays VALORANT — you probably guessed." },
    { off: 41, title: "HOME BASE", fact: "Based in Jaipur, Rajasthan." },
    { off: 50, title: "CURRENT ROLE", fact: "AI Engineer at FLO since May 2026." },
    { off: 38, title: "BILINGUAL", fact: "Speaks English and Hindi." }
  ],

  /* Inbox */
  inbox: [
    { title: "WHAT'S NEW THIS ACT?", sub: "Joined FLO as an AI Engineer", art: "flo",
      body: "May 2026 — started as an AI Engineer at FLO, building LLM-powered solutions and automating intelligent workflows.", cta: "VIEW CAREER", go: "career" },
    { title: "GRADUATED!", sub: "B.Tech CSE — class of 2026", art: "cap",
      body: "Wrapped four years of Computer Science & Engineering at Poornima College of Engineering with a CGPA of 8.6.", cta: "VIEW PROGRESSION", go: "progression" },
    { title: "NEW DROP", sub: "AI Resume Analyzer is live", art: "resume",
      body: "ATS scoring, job matching and personalised career recommendations powered by Groq AI.", cta: "INSPECT", go: "collection" },
    { title: "PATCH NOTES 26.09", sub: "Portfolio client updated", art: "patch",
      body: "New client UI, matchmaking for recruiters, a crosshair cursor and a Night Market. Try FIND MATCH in the lobby.", cta: "BACK TO LOBBY", go: "lobby" }
  ]
};
