/**
 * Achievement Stories Scrollytelling Engine & Dynamic Template Renderer
 * Dynamically fetches data.json, renders left story items and right stage panels,
 * and manages synchronized split-column scrollytelling and image sliders.
 */

// Fallback dataset in case fetch is blocked (e.g. file:/// local protocol)
const DEFAULT_ACHIEVEMENTS_DATA = [
  {
    id: 1,
    number: "01",
    slug: "python-trainer",
    title: "Python Trainer",
    shortTitle: "Python Trainer",
    role: "Lead Python Instructor & Mentor",
    period: "2025 – 2026",
    badge: "Tech Education",
    tagline: "Demystifying programming fundamentals and empowering learners to build real tools and automation scripts.",
    narrative: "Believing that programming literacy should be welcoming rather than intimidating, I authored a practical, beginner-friendly Python training program for community members and aspiring developers. I designed structured slide decks and real-world exercises covering syntax, conditional logic, loops, functions, and file handling. During weekly workshops, I guided students through building their own automation scripts, debugging challenges, and discovering the joy of problem-solving with Python.",
    highlights: [
      "Authored 10+ comprehensive training slide decks and practical weekend coding exercises.",
      "Trained and mentored 40+ enthusiastic learners with zero prior coding background.",
      "Guided students through writing automation scripts, data parsers, and web scraping prototypes."
    ],
    techStack: ["Python", "Jupyter", "Interactive Slides", "Automation", "VS Code"],
    links: [
      { label: "Python Slide Decks", url: "../sharing/index.html", icon: "bi-file-earmark-slides", type: "primary", external: false },
      { label: "Video Lessons", url: "../sharing/main_youtubeCourse.html", icon: "bi-youtube", type: "outline", external: false }
    ],
    images: [
      { src: "assets/images/03-python-1.jpg", alt: "Python Workshop Classroom", contain: false },
      { src: "assets/images/03-python-2.webp", alt: "Python Curriculum and Slide Decks", contain: false }
    ]
  },
  {
    id: 2,
    number: "02",
    slug: "yes-leader",
    title: "YES Leader",
    shortTitle: "YES Leader",
    role: "Volunteer Coordinator & Team Leader",
    period: "Oct 2024 – May 2025",
    badge: "Community & Leadership",
    tagline: "Igniting young imaginations through Scratch block-based visual programming and creative computational thinking.",
    narrative: "As Volunteer Coordinator for Youth Empowering Society (YES), I led a vibrant team of volunteer trainers delivering weekend programming workshops for young students at the Phnom Penh Teacher Education College (PTEC). We created a playful curriculum using Scratch, introducing computational thinking, logic branching, and game design. Watching students with no prior computer access proudly present their own animated stories and games was deeply inspiring. Our team's dedication and social impact were officially recognized with a <strong>Certificate of Honor</strong> from the PTEC Director.",
    highlights: [
      "Coordinated a team of 10+ volunteer trainers conducting weekly hands-on programming labs.",
      "Designed visual Scratch lessons introducing loops, variables, and event-driven interactivity.",
      "Awarded Certificate of Honor from PTEC Director for outstanding volunteer leadership."
    ],
    techStack: ["Scratch", "Computational Thinking", "Youth Mentorship", "Leadership"],
    links: [
      { label: "Volunteer Journey & Certificate", url: "../journey/p4_volunteer.html#yes", icon: "bi-award", type: "primary", external: false }
    ],
    images: [
      { src: "assets/images/04-yes-1.png", alt: "YES Leader Scratch Workshop Banner", contain: false },
      { src: "assets/images/04-yes-2.jpg", alt: "Computational Logic & Workshop Flow", contain: false }
    ]
  },
  {
    id: 3,
    number: "03",
    slug: "sister-of-code",
    title: "Sister of Code (SoC)",
    shortTitle: "Sister of Code",
    role: "Web Developer & UI/UX Designer",
    period: "Apr 2026 – Aug 2026",
    badge: "Web & UI/UX Craft",
    tagline: "Harmonizing analytical systems with clean, responsive, human-centered digital experiences and design systems.",
    narrative: "To ensure my technical systems provide seamless human experiences, I joined Sister of Code to master professional web development and modern UI/UX design. I explored color theory, typography scale, accessibility standards, and responsive frontends with HTML5, CSS3, and Bootstrap 5. Through hands-on collaboration, I co-created <strong>NextStep</strong> (an educational guidance portal) and crafted <strong>Chhnang Khmer</strong> (a digital exhibition celebrating traditional Cambodian pottery in Kampong Chhnang), blending technical precision with storytelling.",
    highlights: [
      "Built comprehensive UI design systems and high-fidelity clickable wireframes in Figma.",
      "Developed fully responsive, accessible web applications adhering to mobile-first standards.",
      "Successfully launched Team Project \"NextStep\" and cultural heritage project \"Chhnang Khmer\"."
    ],
    techStack: ["HTML5", "CSS3", "Bootstrap 5", "Figma", "Framer", "Responsive UI/UX"],
    links: [
      { label: "NextStep Project", url: "../projects/nextstep.html?id=10", icon: "bi-window-stack", type: "primary", external: false },
      { label: "Chhnang Khmer Project", url: "../projects/chhnangKhmer.html?id=6", icon: "bi-palette", type: "outline", external: false }
    ],
    images: [
      { src: "assets/images/05-soc-1.webp", alt: "NextStep Platform Showcase", contain: false },
      { src: "assets/images/05-soc-2.webp", alt: "Chhnang Khmer Cultural Platform", contain: false },
      { src: "assets/images/05-soc-3.webp", alt: "Responsive Web Viewport Layouts", contain: false }
    ]
  },
  {
    id: 4,
    number: "04",
    slug: "techpreneur",
    title: "Techpreneur Bootcamp",
    shortTitle: "Techpreneur",
    role: "Full-Stack Developer & Innovator",
    period: "Jun 2024 – Mar 2025",
    badge: "Agile & Full-Stack",
    tagline: "A dynamic program that inspires top university students to innovate and tackle real-world challenges through cutting-edge technology and entrepreneurial expertise.",
    narrative: "Techpreneur Bootcamp is a dynamic program that inspires top university students to innovate and tackle real-world challenges through cutting-edge technology and entrepreneurial expertise. Implemented under the USAID Digital Workforce Development project, DICHI Academy, and ELIX in partnership with Qwasar Silicon Valley, the program immersed us in intensive software engineering, user-centric product discovery, and agile venture sprints. Over the course of the bootcamp, I completed 52 intensive engineering projects, mastered full-stack architecture, and led technical development for Team 4 \"NeuroDrive\"—earning 1st Place / Grand Prize at the final showcase.",
    highlights: [
      "Selected as a founding cohort fellow for the 9-month Techpreneur Bootcamp under USAID DWD, DICHI Academy, and ELIX.",
      "Completed 52 rigorous software engineering projects certified by Qwasar Silicon Valley covering advanced full-stack web and backend engineering.",
      "Spearheaded technical development for Team 4 NeuroDrive, winning 1st Place / Grand Prize in the corporate venture innovation showcase."
    ],
    techStack: ["Full-Stack Engineering", "Qwasar Silicon Valley", "USAID DWD & DICHI", "JavaScript & Node.js", "Express & MongoDB", "Agile MVP Sprints"],
    links: [
      { label: "NeuroDrive Challenge", url: "../projects/neuroDrive.html", icon: "bi-rocket-takeoff", type: "primary", external: false }
    ],
    images: [
      { src: "assets/images/06-tech-0.png", alt: "USAID and DICHI Academy Techpreneur Bootcamp Founding Cohort Invitation and Acceptance Letter", contain: true },
      { src: "assets/images/06-tech1.png", alt: "Qwasar Silicon Valley Fullstack Software Engineering Certificate - 52 Projects Completed", contain: true },
      { src: "assets/images/06-tech2.png", alt: "Techpreneur Bootcamp Full Stack Development Certificate of Completion", contain: true },
      { src: "assets/images/06-tech1.jpg", alt: "Techpreneur Bootcamp Graduation Stage Award Ceremony with Dignitaries", contain: true },
      { src: "assets/images/06-tech2.jpg", alt: "Team 4 NeuroDrive 1st Place Grand Winner Award Presentation and Plaque", contain: true }
    ]
  },
  {
    id: 5,
    number: "05",
    slug: "aws-cloud",
    title: "AWS Cloud Foundation",
    shortTitle: "AWS Cloud",
    role: "Cloud Architecture & Infrastructure",
    period: "2025",
    badge: "Cloud & DevOps",
    tagline: "Selected for Cloud4Cambodia—an intensive AWS Cloud Foundation bootcamp under the USAID Digital Workforce Development project in partnership with Amazon Web Services.",
    narrative: "Selected to participate in and successfully completed <strong>Cloud4Cambodia</strong>, a 3-week intensive cloud computing bootcamp implemented under the <strong>USAID Digital Workforce Development</strong> project in partnership with <strong>Amazon Web Services (AWS)</strong> and partnering Higher Education Institutions (HEIs). Throughout the bootcamp, I completed intensive learning on the <strong>AWS Cloud Foundation</strong> curriculum, engaging in hands-on lab practices and learning materials hosted on the AWS Academy platform. The program aims to eliminate access barriers to cloud computing resources, empowering participants to attain international industrial certifications and excel in the rapidly evolving ICT sector.",
    highlights: [
      "Selected among top tech students to join the Cloud4Cambodia AWS Cloud Foundation bootcamp hosted at the National University of Management.",
      "Completed extensive hands-on labs and curriculum on the AWS Academy platform covering core cloud infrastructure, security, networking, and compute.",
      "Awarded the official Certificate of Completion recognized by USAID, UC Berkeley Blum Center, elix, and AWS Academy."
    ],
    techStack: ["AWS Cloud Foundation", "AWS Academy", "Cloud Infrastructure", "USAID Digital Workforce", "Cloud Security & IAM"],
    links: [
      { label: "Program Guidebook", url: "https://drive.google.com/file/d/1hxoVVz6Gx7mnHc52NAjeb9G0y8eNAZCR/view", icon: "bi-journal-text", type: "primary", external: true }
    ],
    images: [
      { src: "assets/images/07-aws1.png", alt: "Cloud4Cambodia AWS Cloud Foundation Certificate of Completion", contain: true },
      { src: "assets/images/07-aws2.png", alt: "Cloud4Cambodia Graduation Ceremony Cohort in Phnom Penh", contain: true }
    ]
  },
  {
    id: 6,
    number: "06",
    slug: "korea-camp",
    title: "Global Korea Camp",
    shortTitle: "Korea Camp",
    role: "International Delegate & Tech Fellow",
    period: "2023 & 2024",
    badge: "Global Exchange",
    tagline: "Selected to join the UNESCO UNITWIN Data Analytics & Data Science Camps in Cambodia, organized by Handong Global University and certified by the Ministry of Education, Republic of Korea.",
    narrative: "Selected to join the <strong>2023 UNESCO UNITWIN Data Analytics Camp in Cambodia</strong> (February 13 to February 17, 2023) and subsequently completed the <strong>2024 UNESCO UNITWIN Data Science Camp</strong>, organized jointly by UNESCO UNITWIN and Handong Global University and certified by the Ministry of Education, Republic of Korea. This intensive camp equipped us with practical data analysis and modeling skills, exposed us to real-world data challenges, and enhanced our communication and international networking opportunities.",
    highlights: [
      "Selected among top students from the Department of Applied Mathematics and Statistics (ITC) to participate in the UNESCO UNITWIN Joint Education Program.",
      "Completed intensive hands-on training in Regression, Simulation, AI, and Big Data problem-solving with professors from Handong Global University.",
      "Earned official Certificates of Completion certified by Handong Global University and the Ministry of Education, Republic of Korea for both 2023 and 2024 camps."
    ],
    techStack: ["Data Analytics", "Data Science", "Regression & Simulation", "AI & Big Data", "UNESCO UNITWIN"],
    links: [
      { label: "View on Facebook", url: "https://www.facebook.com/share/p/1BufjrZXz1/", icon: "bi-facebook", type: "primary", external: true }
    ],
    images: [
      { src: "assets/images/08-korea1.png", alt: "2023 UNESCO UNITWIN Data Analytics Camp Certificate", contain: true },
      { src: "assets/images/08-korea2.png", alt: "2024 UNESCO UNITWIN Data Science Camp Certificate", contain: true },
      { src: "assets/images/08-korea3.png", alt: "UNESCO UNITWIN Data Analytics Camp Ceremony", contain: false }
    ]
  },
  {
    id: 7,
    number: "07",
    slug: "career-talk",
    title: "Youth & Their Future Career Talk",
    shortTitle: "Career Talk",
    role: "Team Leader & Project Coordinator",
    period: "2024",
    badge: "IFL Final Project · YRDP Funded",
    tagline: "Empowering Grade 11 high school students through a youth-led career panel discussion and guidance initiative.",
    narrative: "For our Institute of Foreign Languages (IFL) final project, I served as Team Leader directing a 6-member team in conceptualizing, fundraising, and executing the <strong>\"Youth and Their Future Career Talk\"</strong>. We drafted and successfully defended a formal grant proposal to the Youth Resource Development Program (YRDP) to secure project sponsorship. Coordinating with Indratevi High School administration, we hosted an impactful career panel session for Grade 11 students. We invited inspiring guest speakers and industry practitioners across diverse sectors, facilitating an engaging dialogue that equipped high schoolers with essential criteria, self-awareness frameworks, and practical keys for selecting university majors and future careers.",
    highlights: [
      "Led a 6-member team to draft, pitch, and secure grant funding from YRDP (Youth Resource Development Program).",
      "Coordinated with Indratevi High School administration to deliver an interactive career orientation talk for Grade 11 students.",
      "Curated and moderated a panel of guest speakers sharing practical guidance on academic and career pathways."
    ],
    techStack: ["Project Leadership", "Grant Writing", "Event Coordination", "Public Speaking", "Community Engagement"],
    links: [
      { label: "Grant Proposal (YRDP)", url: "../../assets/pdf/grant_proposal_to_yrdp.pdf", icon: "bi-file-earmark-pdf", type: "primary", external: true },
      { label: "Event Activity Report", url: "../../assets/pdf/activity_report_to_yrdp_from_event.pdf", icon: "bi-file-earmark-check", type: "outline", external: true },
      { label: "Career Talk Deck", url: "../../assets/pdf/youth_and_their_future_career.pdf", icon: "bi-file-earmark-slides", type: "outline", external: true }
    ],
    images: [
      { src: "assets/images/09-career-talk-1.webp", alt: "Youth & Their Future Career Talk at Indratevi High School", contain: false },
      { src: "assets/images/09-career-talk-2.webp", alt: "Career Panel Discussion with Guest Speakers", contain: false },
      { src: "assets/images/09-career-talk-3.webp", alt: "Grade 11 Students Interactive Career Discussion", contain: false },
      { src: "assets/images/09-career-talk-4.webp", alt: "Team and High School Community Exchange", contain: false }
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initNavbarAndFooter();
  loadAchievementsAndInit();
});

/**
 * Dynamically loads the shared navigation and footer components.
 */
function initNavbarAndFooter() {
  const isTwoLevelsDeep = window.location.pathname.includes("/pages/");
  const componentPrefix = isTwoLevelsDeep ? "../components/" : "pages/components/";

  // Load Nav
  fetch(componentPrefix + "nav.html?t=" + Date.now())
    .then((res) => (res.ok ? res.text() : Promise.reject("Nav not found")))
    .then((html) => {
      const el = document.getElementById("navbar-placeholder");
      if (el) {
        el.innerHTML = html;
        el.querySelectorAll("script").forEach((oldScript) => {
          const newScript = document.createElement("script");
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript).parentNode.removeChild(newScript);
        });
      }
    })
    .catch((err) => console.warn("Failed to load nav component:", err));

  // Load Footer
  fetch(componentPrefix + "footer.html?t=" + Date.now())
    .then((res) => (res.ok ? res.text() : Promise.reject("Footer not found")))
    .then((html) => {
      const el = document.getElementById("footer-placeholder");
      if (el) el.innerHTML = html;
    })
    .catch((err) => console.warn("Failed to load footer component:", err));
}

/**
 * Fetches data.json (or uses fallback) and generates the DOM for stories, panels, and nav pills.
 */
async function loadAchievementsAndInit() {
  let stories = null;

  try {
    const res = await fetch("assets/data.json?t=" + Date.now());
    if (res.ok) {
      stories = await res.json();
    }
  } catch (err) {
    console.warn("Could not fetch data.json via network, falling back to embedded dataset:", err);
  }

  if (!stories || !Array.isArray(stories) || stories.length === 0) {
    stories = DEFAULT_ACHIEVEMENTS_DATA;
  }

  renderAchievements(stories);

  // Initialize scrollytelling, sliders, and interaction engines after DOM is populated
  initScrollytelling();
  initNestedSliders();
  initStoryCopyButtons();
}

/**
 * Generates the HTML markup for left narrative cards, right stage panels, nav pills, and dots.
 */
function renderAchievements(stories) {
  const navContainer = document.querySelector(".achievement-nav-pills");
  const listContainer = document.getElementById("achievement-list");
  const dotsContainer = document.querySelector(".stage-dots-nav");
  const stageViewport = document.querySelector(".stage-viewport");
  const trackerNum = document.getElementById("stage-tracker-num");
  const trackerTitle = document.getElementById("stage-tracker-title");

  // 1. Quick-jump hero pills
  if (navContainer) {
    navContainer.innerHTML = stories
      .map(
        (story, idx) => `
          <a href="#${story.slug}" class="achievement-pill-btn ${idx === 0 ? "active" : ""}" data-index="${story.id}" data-slug="${story.slug}">
            <span class="pill-num">${story.number}</span> ${story.shortTitle || story.title}
          </a>
        `
      )
      .join("");
  }

  // 2. Left column narrative cards
  if (listContainer) {
    listContainer.innerHTML = stories.map((story, idx) => renderStoryCard(story, idx)).join("");
  }

  // 3. Stage dots selector
  if (dotsContainer) {
    dotsContainer.innerHTML = stories
      .map(
        (story, idx) => `
          <button type="button" class="stage-dot-btn ${idx === 0 ? "active" : ""}" data-index="${story.id}" title="Story ${story.id}: ${story.shortTitle || story.title}"></button>
        `
      )
      .join("");
  }

  // 4. Right stage preview panels
  if (stageViewport) {
    stageViewport.innerHTML = stories.map((story, idx) => renderStagePanel(story, idx)).join("");
  }

  // 5. Initialize tracker badge with first story
  if (stories.length > 0) {
    if (trackerNum) trackerNum.textContent = stories[0].number;
    if (trackerTitle) trackerTitle.textContent = stories[0].title;
  }
}

/**
 * Builds HTML for a single left-hand narrative story card.
 */
function renderStoryCard(story, idx) {
  const images = story.images || [];
  const hasMultipleImages = images.length > 1;

  const highlightsHtml = (story.highlights || [])
    .map((h) => `<li>${h}</li>`)
    .join("");

  const techTagsHtml = (story.techStack || [])
    .map((t) => `<span class="tech-tag">${t}</span>`)
    .join("");

  const linksHtml = (story.links || [])
    .map((link) => {
      const btnClass = link.type === "outline" ? "story-btn-outline" : "story-btn-primary";
      const targetAttr = link.external ? 'target="_blank" rel="noopener noreferrer"' : "";
      return `
        <a href="${link.url}" ${targetAttr} class="story-btn ${btnClass}">
          <i class="bi ${link.icon}"></i> ${link.label}
        </a>
      `;
    })
    .join("");

  const mobileSlidesHtml = images
    .map(
      (img, i) => `
        <div class="slider-slide ${img.contain ? "cert-slide" : ""} ${i === 0 ? "active" : ""}" data-slide-index="${i}">
          <img src="${img.src}" alt="${img.alt}" ${img.contain ? 'class="cert-contain-img"' : ""} loading="lazy" />
        </div>
      `
    )
    .join("");

  const mobileControlsHtml = hasMultipleImages
    ? `
      <button type="button" class="btn sec-testimonials-nav-btn sec-testimonials-prev" aria-label="Previous slide" tabindex="0">
        <i class="bi bi-chevron-left"></i>
      </button>
      <button type="button" class="btn sec-testimonials-nav-btn sec-testimonials-next" aria-label="Next slide" tabindex="0">
        <i class="bi bi-chevron-right"></i>
      </button>
      <div class="slider-indicators">
        ${images.map((_, i) => `<span class="slider-dot ${i === 0 ? "active" : ""}" data-slide-to="${i}"></span>`).join("")}
      </div>
    `
    : "";

  return `
    <li class="achievement-story-item ${idx === 0 ? "is-active" : ""}" id="story-${story.id}" data-index="${story.id}" data-slug="${story.slug}">
      <span id="${story.slug}" class="story-anchor-target" aria-hidden="true"></span>
      <div class="story-header-wrap">
        <span class="story-number" aria-hidden="true">${story.number}</span>
        <button type="button" class="story-title-btn" aria-label="View Story ${story.id}: ${story.title}">
          <h2 class="story-title">${story.title}</h2>
        </button>
        <button type="button" class="story-copy-link-btn" data-slug="${story.slug}" title="Copy link to ${story.title}" aria-label="Copy direct link to ${story.title}">
          <i class="bi bi-link-45deg"></i>
          <span class="copy-tooltip">Copy link</span>
        </button>
      </div>

      <div class="story-meta-row">
        <span class="story-role">${story.role}</span>
        <span class="text-muted">•</span>
        <span class="story-period">${story.period}</span>
        <span class="story-tag-pill">${story.badge || ""}</span>
      </div>

      <div class="story-content-wrap">
        <p class="story-tagline">${story.tagline || ""}</p>
        <p class="story-narrative">${story.narrative || ""}</p>

        ${highlightsHtml ? `<ul class="story-highlights-list">${highlightsHtml}</ul>` : ""}

        ${techTagsHtml ? `<div class="story-tech-tags">${techTagsHtml}</div>` : ""}

        ${linksHtml ? `<div class="story-actions">${linksHtml}</div>` : ""}

        <!-- Mobile Inline Showcase with Nested Slider -->
        <div class="mobile-story-showcase d-lg-none mt-4">
          <div class="mobile-img-box">
            <div class="panel-slider" data-story-slider="m-${story.id}">
              <div class="slider-track">
                ${mobileSlidesHtml}
              </div>
              ${mobileControlsHtml}
            </div>
          </div>
        </div>
      </div>
    </li>
  `;
}

/**
 * Builds HTML for a single right-hand sticky stage preview panel.
 */
function renderStagePanel(story, idx) {
  const images = story.images || [];
  const hasMultipleImages = images.length > 1;

  const slidesHtml = images
    .map(
      (img, i) => `
        <div class="slider-slide ${img.contain ? "cert-slide" : ""} ${i === 0 ? "active" : ""}" data-slide-index="${i}">
          <img src="${img.src}" alt="${img.alt}" class="panel-backdrop-img ${img.contain ? "cert-contain-img" : ""}" />
        </div>
      `
    )
    .join("");

  const controlsHtml = hasMultipleImages
    ? `
      <button type="button" class="btn sec-testimonials-nav-btn sec-testimonials-prev" aria-label="Previous slide" tabindex="0">
        <i class="bi bi-chevron-left"></i>
      </button>
      <button type="button" class="btn sec-testimonials-nav-btn sec-testimonials-next" aria-label="Next slide" tabindex="0">
        <i class="bi bi-chevron-right"></i>
      </button>
      <div class="slider-indicators">
        ${images.map((_, i) => `<span class="slider-dot ${i === 0 ? "active" : ""}" data-slide-to="${i}"></span>`).join("")}
      </div>
    `
    : "";

  return `
    <div class="stage-preview-panel ${idx === 0 ? "active" : ""}" data-index="${story.id}">
      <div class="panel-slider" data-story-slider="${story.id}">
        <div class="slider-track">
          ${slidesHtml}
        </div>
        ${controlsHtml}
      </div>
    </div>
  `;
}

/**
 * Helper to locate an achievement story element by hash string (ID, slug, or story-index).
 */
function findStoryItemByHash(hash) {
  if (!hash) return null;
  const clean = hash.replace("#", "").trim().toLowerCase();
  if (!clean) return null;

  // 1. Direct ID match (e.g. #story-1 or #techpreneur)
  const byId = document.getElementById(clean);
  if (byId) {
    return byId.classList.contains("achievement-story-item")
      ? byId
      : byId.closest(".achievement-story-item");
  }

  // 2. data-slug match (e.g. data-slug="techpreneur")
  const bySlug = document.querySelector(`.achievement-story-item[data-slug="${clean}"]`);
  if (bySlug) return bySlug;

  // 3. Story index or story-N match
  const num = clean.replace("story-", "").replace("story", "");
  if (num && !isNaN(num)) {
    const byNum = document.querySelector(`.achievement-story-item[data-index="${num}"]`);
    if (byNum) return byNum;
  }

  return null;
}

/**
 * Initializes IntersectionObserver to track which story is in focus,
 * updating the active story item and the sticky right stage panel.
 * Also handles direct URL hash navigation and scroll sync.
 */
function initScrollytelling() {
  const storyItems = document.querySelectorAll(".achievement-story-item");
  const stagePanels = document.querySelectorAll(".stage-preview-panel");
  const stageDots = document.querySelectorAll(".stage-dot-btn");
  const navPills = document.querySelectorAll(".achievement-pill-btn");
  const trackerText = document.getElementById("stage-tracker-num");
  const trackerTitle = document.getElementById("stage-tracker-title");

  if (!storyItems.length) return;

  let currentActiveIndex = 1;
  let isProgrammaticScrolling = false;
  let programmaticScrollTimer = null;

  // Switch active story across all UI components
  function setActiveStory(index, updateUrlHash = false) {
    if (index === currentActiveIndex) return;
    currentActiveIndex = index;

    // 1. Update left story items
    storyItems.forEach((item) => {
      const itemIndex = parseInt(item.getAttribute("data-index"), 10);
      if (itemIndex === index) {
        item.classList.add("is-active");
      } else {
        item.classList.remove("is-active");
      }
    });

    // 2. Update right sticky preview panels
    stagePanels.forEach((panel) => {
      const panelIndex = parseInt(panel.getAttribute("data-index"), 10);
      if (panelIndex === index) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    // 3. Update stage dot indicator buttons
    stageDots.forEach((dot) => {
      const dotIndex = parseInt(dot.getAttribute("data-index"), 10);
      if (dotIndex === index) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    // 4. Update horizontal hero pills
    navPills.forEach((pill) => {
      const pillIndex = parseInt(pill.getAttribute("data-index"), 10);
      if (pillIndex === index) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });

    // 5. Update stage header numbers & title
    if (trackerText) {
      trackerText.textContent = String(index).padStart(2, "0");
    }

    const activeItem = document.querySelector(`.achievement-story-item[data-index="${index}"]`);
    if (activeItem && trackerTitle) {
      const titleElem = activeItem.querySelector(".story-title");
      if (titleElem) {
        trackerTitle.textContent = titleElem.textContent.trim();
      }

      // Sync browser address bar with current story slug
      if (updateUrlHash && window.history && window.history.replaceState) {
        const slug = activeItem.getAttribute("data-slug");
        if (slug && window.scrollY > 200) {
          window.history.replaceState(null, null, `#${slug}`);
        }
      }
    }
  }

  // Smoothly navigates to a specific story item with navbar offset and focus pulse
  function navigateToStory(targetItem, updateHash = true, pulse = true) {
    if (!targetItem) return;
    const index = parseInt(targetItem.getAttribute("data-index"), 10);
    const slug = targetItem.getAttribute("data-slug");

    isProgrammaticScrolling = true;
    clearTimeout(programmaticScrollTimer);
    programmaticScrollTimer = setTimeout(() => {
      isProgrammaticScrolling = false;
    }, 850);

    setActiveStory(index, false);

    // Smooth scroll taking fixed navbar (height ~76px + buffer) into account
    const headerOffset = 88;
    const elementPosition = targetItem.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: "smooth"
    });

    if (pulse) {
      targetItem.classList.add("story-target-pulse");
      setTimeout(() => targetItem.classList.remove("story-target-pulse"), 2200);
    }

    if (updateHash && slug && window.history && window.history.pushState) {
      window.history.pushState(null, null, `#${slug}`);
    }
  }

  // Setup IntersectionObserver for smooth scroll detection
  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -40% 0px",
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    if (isProgrammaticScrolling) return;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute("data-index"), 10);
        if (index) {
          setActiveStory(index, true);
        }
      }
    });
  }, observerOptions);

  storyItems.forEach((item) => observer.observe(item));

  // Fallback scroll listener for edge cases (e.g. fast scrolling)
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (isProgrammaticScrolling) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const targetY = window.innerHeight * 0.35;
      let closestItem = null;
      let minDistance = Infinity;

      storyItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height * 0.3;
        const distance = Math.abs(itemCenter - targetY);
        if (distance < minDistance) {
          minDistance = distance;
          closestItem = item;
        }
      });

      if (closestItem) {
        const index = parseInt(closestItem.getAttribute("data-index"), 10);
        if (index && index !== currentActiveIndex) {
          setActiveStory(index, true);
        }
      }
    }, 60);
  }, { passive: true });

  // Handle Initial Landing via URL Hash (e.g., #techpreneur, #story-2, #python-trainer)
  const initialHash = window.location.hash;
  const initialTarget = findStoryItemByHash(initialHash);

  if (initialTarget) {
    const initIndex = parseInt(initialTarget.getAttribute("data-index"), 10);
    setActiveStory(initIndex, false);
    setTimeout(() => {
      navigateToStory(initialTarget, false, true);
    }, 200);
  } else {
    setActiveStory(1, false);
  }

  // Listen for browser Back/Forward or manual hash modifications
  window.addEventListener("hashchange", () => {
    const target = findStoryItemByHash(window.location.hash);
    if (target) {
      navigateToStory(target, false, true);
    }
  });

  // Click listeners on hero quick jump pills
  navPills.forEach((pill) => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      const slug = pill.getAttribute("data-slug");
      const index = parseInt(pill.getAttribute("data-index"), 10);
      const target = findStoryItemByHash(slug) || document.querySelector(`.achievement-story-item[data-index="${index}"]`);
      if (target) {
        navigateToStory(target, true, true);
      }
    });
  });

  // Click listeners on story title buttons
  document.querySelectorAll(".story-title-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const item = btn.closest(".achievement-story-item");
      if (item) {
        navigateToStory(item, true, true);
      }
    });
  });

  // Click listeners on stage dots (desktop top bar)
  stageDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-index"), 10);
      const target = document.querySelector(`.achievement-story-item[data-index="${index}"]`);
      if (target) {
        navigateToStory(target, true, true);
      }
    });
  });

  // Keyboard navigation when page or list is focused
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (currentActiveIndex < storyItems.length) {
        const nextItem = document.querySelector(`.achievement-story-item[data-index="${currentActiveIndex + 1}"]`);
        if (nextItem) navigateToStory(nextItem, true, true);
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (currentActiveIndex > 1) {
        const prevItem = document.querySelector(`.achievement-story-item[data-index="${currentActiveIndex - 1}"]`);
        if (prevItem) navigateToStory(prevItem, true, true);
      }
    }
  });
}

/**
 * Initializes direct section copy link buttons and toast notifications.
 */
function initStoryCopyButtons() {
  const toast = document.getElementById("achievement-copy-toast");
  const toastMsg = document.getElementById("achievement-toast-msg");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  function fallbackCopyText(text) {
    return new Promise((resolve, reject) => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        textarea.style.left = "-9999px";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) resolve();
        else reject(new Error("execCommand copy failed"));
      } catch (err) {
        reject(err);
      }
    });
  }

  document.querySelectorAll(".story-copy-link-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const slug = btn.getAttribute("data-slug");
      const url = `${window.location.origin}${window.location.pathname}#${slug}`;

      const copyPromise = navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(url)
        : fallbackCopyText(url);

      Promise.resolve(copyPromise)
        .then(() => {
          btn.classList.add("copied");
          const icon = btn.querySelector("i");
          const tooltip = btn.querySelector(".copy-tooltip");
          if (icon) icon.className = "bi bi-check2";
          if (tooltip) tooltip.textContent = "Copied!";

          showToast(`Direct link copied: #${slug}`);

          if (window.history && window.history.pushState) {
            window.history.pushState(null, null, `#${slug}`);
          }

          setTimeout(() => {
            btn.classList.remove("copied");
            if (icon) icon.className = "bi bi-link-45deg";
            if (tooltip) tooltip.textContent = "Copy link";
          }, 2200);
        })
        .catch((err) => {
          console.warn("Clipboard write failed:", err);
          showToast(`Direct link: #${slug}`);
        });
    });
  });
}

/**
 * Initializes nested image sliders within each story panel and mobile card.
 */
function initNestedSliders() {
  document.querySelectorAll(".panel-slider").forEach((slider) => {
    const slides = slider.querySelectorAll(".slider-slide");
    const dots = slider.querySelectorAll(".slider-dot");
    const prevBtn = slider.querySelector(".sec-testimonials-prev");
    const nextBtn = slider.querySelector(".sec-testimonials-next");

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      const ind = slider.querySelector(".slider-indicators");
      if (ind) ind.style.display = "none";
      return;
    }

    let currentIndex = 0;

    function goToSlide(idx) {
      if (idx < 0) idx = slides.length - 1;
      if (idx >= slides.length) idx = 0;
      currentIndex = idx;

      slides.forEach((s, i) => {
        if (i === currentIndex) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });

      dots.forEach((d, i) => {
        if (i === currentIndex) {
          d.classList.add("active");
        } else {
          d.classList.remove("active");
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach((dot, dotIdx) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(dotIdx);
      });
    });
  });
}
