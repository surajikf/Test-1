const DATA_SETS = {
  heroMetrics: [
    { value: "98.4%", label: "Release readiness", meta: "Avg across 5 launches" },
    { value: "0 Sev1", label: "Prod defects", meta: "Last 9 go-lives" },
    { value: "6 squads", label: "QA coaching", meta: "Scrum & Kanban teams" },
  ],
  hrSnapshot: [
    { label: "Notice period", value: "30 days", meta: "Fast-track when needed" },
    { label: "Preferred roles", value: "Senior QA · QA Lead · SDET", meta: "Manual + automation" },
    { label: "Location", value: "Pune / Remote", meta: "Open to travel in India" },
    { label: "Engagement", value: "Full-time", meta: "Contract-to-hire friendly" },
    { label: "Shift", value: "IST / Flexible overlap", meta: "US & EU timezone overlap" },
    { label: "Comp range", value: "Industry standard", meta: "Aligned during screening" },
  ],
  valueSignals: [
    {
      title: "Release governance",
      body: "Owns go/no-go dashboards, aligns QA exit criteria with product & engineering.",
    },
    {
      title: "Automation uplift",
      body: "Introduced smoke & regression suites (Selenium + Postman) that cut test cycles by 35%.",
    },
    {
      title: "Customer empathy",
      body: "Maps prod telemetry with QA charters to surface hidden CX issues early.",
    },
    {
      title: "Stakeholder clarity",
      body: "Translates complex QA risks into simple traffic-light comms for leadership.",
    },
  ],
  insights: [
    {
      label: "Release readiness",
      value: "96%",
      meta: "Gate met in 11 of last 12 sprints",
      delta: "+6 pts QoQ",
    },
    {
      label: "Automation coverage",
      value: "78%",
      meta: "Regression pack (web + API)",
      delta: "+14 suites",
    },
    {
      label: "Defect containment",
      value: "92%",
      meta: "Defects trapped pre-UAT",
      delta: "Best-in-class",
    },
  ],
  automation: [
    { label: "UI regression", current: 82, goal: 80, note: "Nightly Selenium grid" },
    { label: "API flows", current: 74, goal: 75, note: "Postman + Newman CI" },
    { label: "Performance baselines", current: 68, goal: 70, note: "JMeter weekly runs" },
  ],
  radar: [
    { title: "Checkout stability", detail: "3 sprint burn-down, 0 Sev1 incidents" },
    { title: "Payments UX", detail: "Monitoring bank SDK update & fallback" },
    { title: "Ops analytics", detail: "Live dashboard on UAT defect density" },
  ],
  focus: [
    { title: "Platform refresh", detail: "Guiding QA strategy for React migration" },
    { title: "Mobile parity", detail: "Aligning Android & iOS regression packs" },
    { title: "Knowledge base", detail: "Curating QA playbooks for new squad members" },
  ],
  timeline: [
    { period: "2024 Q4", detail: "Payments revamp go-live", meta: "0 critical issues post launch" },
    { period: "2024 Q3", detail: "Ticketing platform scale-up", meta: "Cut checkout issues by 60%" },
    { period: "2024 Q2", detail: "E-commerce redesign", meta: "Introduced A/B QA readiness gates" },
    { period: "2023 Q4", detail: "Automation uplift", meta: "Brought API coverage from 40% to 74%" },
  ],
  fit: [
    { label: "Reporting lines", value: "Product, Engineering, Program Management" },
    { label: "Team size sweet spot", value: "3–6 squads or a QA chapter" },
    { label: "Engagement model", value: "Hybrid / remote, willing to travel for PI planning" },
    { label: "Tools comfort", value: "Jira, Azure DevOps, Confluence, TestRail" },
    { label: "Languages", value: "English, Hindi, Marathi" },
  ],
  testimonials: [
    {
      quote:
        "Suraj turns ambiguous acceptance criteria into measurable quality goals. His QA scorecards gave us our first zero-defect launch in EMEA.",
      author: "Delivery Head",
      role: "Automotive Digital",
    },
    {
      quote:
        "He anticipates production risk a sprint early and arrives with mitigation options and data. A true extension of product and engineering.",
      author: "Product Manager",
      role: "Payments Platform",
    },
  ],
};

const THEME_KEY = "suraj-theme";
const AVAILABILITY_KEY = "suraj-availability-index";

const availabilityStatuses = [
  { label: "Interview ready", className: "status-green" },
  { label: "Interviewing", className: "status-amber" },
  { label: "Heads-up only", className: "status-red" },
];

const $ = (id) => document.getElementById(id);

const render = (id, html) => {
  const el = $(id);
  if (el) {
    el.innerHTML = html;
  }
};

const createHeroMetrics = () =>
  DATA_SETS.heroMetrics
    .map(
      (metric) => `
      <div class="hero-metric">
        <div class="hero-metric-value">${metric.value}</div>
        <p class="hero-metric-label">
          ${metric.label}<br />
          <span class="muted">${metric.meta}</span>
        </p>
      </div>
    `
    )
    .join("");

const createHrSnapshot = () =>
  DATA_SETS.hrSnapshot
    .map(
      (item) => `
      <div class="hr-item">
        <span class="hr-label">${item.label}</span>
        <p class="hr-value">${item.value}</p>
        <p class="hr-meta">${item.meta}</p>
      </div>
    `
    )
    .join("");

const createValueSignals = () =>
  DATA_SETS.valueSignals
    .map(
      (item) => `
      <li class="value-item">
        <strong>${item.title}</strong>
        <p>${item.body}</p>
      </li>
    `
    )
    .join("");

const createInsights = () =>
  DATA_SETS.insights
    .map(
      (insight) => `
      <article class="insight-card">
        <p class="insight-label">${insight.label}</p>
        <p class="insight-value">${insight.value}</p>
        <p class="insight-meta">${insight.meta}</p>
        ${insight.delta ? `<span class="insight-delta">${insight.delta}</span>` : ""}
      </article>
    `
    )
    .join("");

const createAutomation = () =>
  DATA_SETS.automation
    .map((row) => {
      const pct =
        row.goal && row.goal > 0 ? Math.min(100, Math.round((row.current / row.goal) * 100)) : row.current;
      return `
        <div class="automation-row">
          <div class="automation-title">
            <span>${row.label}</span>
            <span>${row.current}% / ${row.goal}%</span>
          </div>
          <div class="automation-progress">
            <div class="automation-progress-fill" style="width: ${pct}%"></div>
          </div>
          <p class="automation-note muted">${row.note}</p>
        </div>
      `;
    })
    .join("");

const createList = (items, className) =>
  items
    .map(
      (item) => `
      <li class="${className}">
        <strong>${item.title}</strong>
        <span>${item.detail}</span>
      </li>
    `
    )
    .join("");

const createTimeline = () =>
  DATA_SETS.timeline
    .map(
      (entry) => `
      <li class="timeline-item">
        <strong>${entry.period}</strong>
        <span>${entry.detail}</span>
        <span class="muted">${entry.meta}</span>
      </li>
    `
    )
    .join("");

const createFitList = () =>
  DATA_SETS.fit
    .map(
      (item) => `
      <li>
        <span class="fit-label">${item.label}</span>
        <strong>${item.value}</strong>
      </li>
    `
    )
    .join("");

const createTestimonials = () =>
  DATA_SETS.testimonials
    .map(
      (item) => `
      <figure class="testimonial">
        <blockquote>${item.quote}</blockquote>
        <figcaption>${item.author} — ${item.role}</figcaption>
      </figure>
    `
    )
    .join("");

const setTheme = (theme) => {
  if (theme === "dark") {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.removeAttribute("data-theme");
  }
  localStorage.setItem(THEME_KEY, theme);
};

const initTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  setTheme(theme);

  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = document.body.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }
};

const setAvailability = (index) => {
  const button = document.getElementById("availabilityToggle");
  if (!button) return;

  const status = availabilityStatuses[index];
  button.textContent = status.label;
  button.classList.remove("status-green", "status-amber", "status-red");
  button.classList.add(status.className);
  localStorage.setItem(AVAILABILITY_KEY, index.toString());
};

const initAvailability = () => {
  const storedIndex = Number(localStorage.getItem(AVAILABILITY_KEY)) || 0;
  setAvailability(storedIndex);

  const button = document.getElementById("availabilityToggle");
  if (button) {
    button.addEventListener("click", () => {
      const nextIndex = (Number(localStorage.getItem(AVAILABILITY_KEY)) + 1) % availabilityStatuses.length;
      setAvailability(nextIndex);
    });
  }
};

const initCopyButtons = () => {
  const buttons = document.querySelectorAll("[data-copy]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        const original = btn.textContent;
        btn.textContent = "Copied!";
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 1500);
      } catch (error) {
        console.error("Clipboard error", error);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  render("heroMetrics", createHeroMetrics());
  render("hrGrid", createHrSnapshot());
  render("valueList", createValueSignals());
  render("insightGrid", createInsights());
  render("automationGrid", createAutomation());
  render("radarList", createList(DATA_SETS.radar, "radar-item"));
  render("focusList", createList(DATA_SETS.focus, "focus-item"));
  render("timelineList", createTimeline());
  render("fitList", createFitList());
  render("testimonialGrid", createTestimonials());

  initTheme();
  initAvailability();
  initCopyButtons();
});
