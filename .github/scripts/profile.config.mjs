/**
 * Central configuration, design tokens, and shared SVG helpers
 * for Banuja Kaushalya's GitHub Profile Kit (Linear / Vercel Bento style).
 */

export const PROFILE_CONFIG = {
  username: "banujakaushalya",
  name: "Banuja Kaushalya",
  role: "Full-Stack Developer & SaaS Builder",
  statusPill: "SHIPPING POS SAAS · OPEN TO AMBITIOUS PROJECTS",
  heroSubtitle:
    "Full-Stack Engineer crafting scalable web apps, SaaS products & AI-powered experiences.",
  tickerLines: [
    "Building POS System SaaS — dynamic modules, pricing & cloud ops",
    "Exploring AI/ML integration — vision & from-scratch neural nets",
    "Deep-diving into DevOps, clean architecture & AWS cloud infra",
  ],
  terminalFile: "banuja@dev — profile.ts",
  terminalCommand: "npx tsx profile.ts --inspect",
  terminalLines: [
    [
      { text: "export const ", kind: "kw" },
      { text: "engineer", kind: "var" },
      { text: " = {", kind: "punc" },
    ],
    [
      { text: "  name: ", kind: "prop" },
      { text: '"Banuja Kaushalya"', kind: "str" },
      { text: ",", kind: "punc" },
    ],
    [
      { text: "  focus: ", kind: "prop" },
      { text: '["Full-Stack SaaS", "AI/ML", "Cloud"]', kind: "str" },
      { text: ",", kind: "punc" },
    ],
    [
      { text: "  shipping: ", kind: "prop" },
      { text: '"POS System SaaS"', kind: "accent" },
      { text: ",", kind: "punc" },
    ],
    [
      { text: "  hobby: ", kind: "prop" },
      { text: '"Learn2Earn"', kind: "str" },
      { text: ",", kind: "punc" },
    ],
    [
      { text: "  principles: ", kind: "prop" },
      { text: '["Clean Arch", "Docs", "DX"]', kind: "str" },
      { text: ",", kind: "punc" },
    ],
    [
      { text: "  openTo: ", kind: "prop" },
      { text: '"Impactful & ambitious builds"', kind: "str" },
    ],
    [{ text: "};", kind: "punc" }],
  ],
  pillars: [
    {
      title: "Clean Architecture",
      subtitle: "Modular & readable systems",
      accent: "indigo",
    },
    {
      title: "End-to-End SaaS",
      subtitle: "Database to polished UI",
      accent: "emerald",
    },
    {
      title: "AI / ML Pipelines",
      subtitle: "Vision & custom models",
      accent: "cyan",
    },
    {
      title: "Cloud & DevOps",
      subtitle: "AWS scale & automation",
      accent: "violet",
    },
  ],
  focusItems: [
    {
      title: "POS System SaaS",
      meta: "Flagship · Active",
      accent: "emerald",
      pulse: true,
    },
    {
      title: "AI / ML Web Integration",
      meta: "Vision & Neural Nets",
      accent: "cyan",
      pulse: false,
    },
    {
      title: "DevOps & Cloud Infra",
      meta: "AWS · CI/CD",
      accent: "indigo",
      pulse: false,
    },
  ],
  projects: [
    {
      id: "pos",
      title: "POS System SaaS",
      badge: "BUILDING · SAAS",
      accent: "emerald",
      icon: "layers",
      description: [
        "All-in-one SaaS platform where businesses run",
        "operations with dynamic features & pricing.",
      ],
      tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
      url: "https://github.com/banujakaushalya",
    },
    {
      id: "learn2earn",
      title: "Learn2Earn",
      badge: "HOBBY · PRODUCT",
      accent: "amber",
      icon: "spark",
      description: [
        "Gamified learning-to-earning web product",
        "exploring engaging UX & scalable architecture.",
      ],
      tags: ["React", "TypeScript", "Node.js", "MongoDB"],
      url: "https://github.com/banujakaushalya",
    },
    {
      id: "face",
      title: "face-recognition-web",
      badge: "AI · VISION",
      accent: "cyan",
      icon: "eye",
      description: [
        "Full-stack facial recognition web app powered",
        "by Python deep neural nets & vector search.",
      ],
      tags: ["Python", "InsightFace", "OpenCV", "Vector DB", "Tailwind"],
      url: "https://github.com/banujakaushalya/face-recognition-web",
    },
    {
      id: "sentiment",
      title: "sentiment-analysis-neural-network",
      badge: "ML · FROM SCRATCH",
      accent: "indigo",
      icon: "cpu",
      description: [
        "End-to-end ML training & inference pipeline",
        "built in vanilla JS with manual matrix math.",
      ],
      tags: ["JavaScript", "Neural Nets", "Backprop", "Zero Libs"],
      url: "https://github.com/banujakaushalya/sentiment-analysis-neural-network",
    },
  ],
  spotlightProject: {
    id: "campushub",
    title: "CampusHub",
    badge: "OPEN SOURCE · FULL-STACK",
    accent: "violet",
    description:
      "Student services platform coordinating clubs, events, workshops & sports across institutions.",
    tags: ["PHP", "MySQL", "Web App"],
    url: "https://github.com/banujakaushalya/campushub",
  },
  techStack: [
    {
      category: "FRONTEND & UI",
      accent: "cyan",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "HTML5 / CSS3",
      ],
    },
    {
      category: "BACKEND & SYSTEMS",
      accent: "indigo",
      items: [
        "Node.js",
        "Python",
        "Java",
        "PHP",
        "REST APIs",
        "Clean Architecture",
      ],
    },
    {
      category: "AI / ML & VISION",
      accent: "violet",
      items: [
        "Deep Neural Nets",
        "OpenCV",
        "InsightFace",
        "Vector DBs",
        "ML Pipelines",
      ],
    },
    {
      category: "DATABASES & CLOUD",
      accent: "emerald",
      items: [
        "PostgreSQL",
        "MongoDB",
        "MySQL",
        "AWS",
        "Docker & DevOps",
        "Git & GitHub",
      ],
    },
  ],
  socials: [
    {
      id: "linkedin",
      label: "LinkedIn",
      accent: "cyan",
      icon: "linkedin",
      url: "https://linkedin.com/in/YOUR_LINKEDIN",
    },
    {
      id: "portfolio",
      label: "Portfolio",
      accent: "indigo",
      icon: "globe",
      url: "https://YOUR_PORTFOLIO_URL",
    },
    {
      id: "email",
      label: "Email",
      accent: "emerald",
      icon: "mail",
      url: "mailto:YOUR_EMAIL@example.com",
    },
    {
      id: "github",
      label: "GitHub",
      accent: "violet",
      icon: "github",
      url: "https://github.com/banujakaushalya",
    },
  ],
  quote: "Impossible is a word to be found only in the dictionary of fools.",
  quoteAuthor: "Napoleon Bonaparte",
};

export const FONT_SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
export const FONT_MONO =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";

export const THEMES = {
  dark: {
    mode: "dark",
    canvasBg: "#0d1117",
    cardStart: "#0d111a",
    cardEnd: "#111827",
    cellBg: "#141b29",
    cellBgAlt: "#101725",
    border: "#242f42",
    borderStrong: "#31405a",
    hairline: "rgba(255,255,255,0.09)",
    divider: "#1e293b",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    gridDot: "#243044",
    pillBg: "#161f30",
    pillBorder: "#29364d",
    pillText: "#cbd5e1",
    orbAlpha: "0.22",
    syn: {
      kw: "#c084fc",
      var: "#f8fafc",
      prop: "#7dd3fc",
      str: "#6ee7b7",
      accent: "#a5b4fc",
      punc: "#64748b",
    },
    accents: {
      indigo: { main: "#818cf8", soft: "rgba(99,102,241,0.16)", stroke: "rgba(129,140,248,0.38)", text: "#a5b4fc" },
      cyan: { main: "#22d3ee", soft: "rgba(34,211,238,0.14)", stroke: "rgba(34,211,238,0.36)", text: "#67e8f9" },
      violet: { main: "#a78bfa", soft: "rgba(167,139,250,0.15)", stroke: "rgba(167,139,250,0.38)", text: "#c4b5fd" },
      emerald: { main: "#34d399", soft: "rgba(52,211,153,0.14)", stroke: "rgba(52,211,153,0.36)", text: "#6ee7b7" },
      amber: { main: "#fbbf24", soft: "rgba(251,191,36,0.14)", stroke: "rgba(251,191,36,0.36)", text: "#fcd34d" },
    },
  },
  light: {
    mode: "light",
    canvasBg: "#ffffff",
    cardStart: "#ffffff",
    cardEnd: "#f8fafc",
    cellBg: "#f8fafc",
    cellBgAlt: "#f1f5f9",
    border: "#e2e8f0",
    borderStrong: "#cbd5e1",
    hairline: "rgba(255,255,255,0.95)",
    divider: "#e2e8f0",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#64748b",
    gridDot: "#cbd5e1",
    pillBg: "#f1f5f9",
    pillBorder: "#cbd5e1",
    pillText: "#334155",
    orbAlpha: "0.14",
    syn: {
      kw: "#7c3aed",
      var: "#0f172a",
      prop: "#0369a1",
      str: "#047857",
      accent: "#4f46e5",
      punc: "#64748b",
    },
    accents: {
      indigo: { main: "#4f46e5", soft: "rgba(79,70,229,0.09)", stroke: "rgba(79,70,229,0.28)", text: "#4338ca" },
      cyan: { main: "#0891b2", soft: "rgba(8,145,178,0.09)", stroke: "rgba(8,145,178,0.28)", text: "#0e7490" },
      violet: { main: "#7c3aed", soft: "rgba(124,58,237,0.09)", stroke: "rgba(124,58,237,0.28)", text: "#6d28d9" },
      emerald: { main: "#059669", soft: "rgba(5,150,105,0.09)", stroke: "rgba(5,150,105,0.28)", text: "#047857" },
      amber: { main: "#d97706", soft: "rgba(217,119,6,0.10)", stroke: "rgba(217,119,6,0.28)", text: "#b45309" },
    },
  },
};

export function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Computes pill width cleanly and wraps pills across rows when exceeding maxWidth.
 */
export function renderPills(
  pills,
  startX,
  startY,
  maxWidth,
  theme,
  options = {}
) {
  const {
    pillHeight = 24,
    gapX = 7,
    gapY = 8,
    fontSize = 11,
    charWidth = 6.2,
    padX = 18,
    accentKey = null,
  } = options;

  let cursorX = startX;
  let cursorY = startY;
  const parts = [];

  for (const label of pills) {
    const safeLabel = escapeXml(label);
    const width = Math.ceil(label.length * charWidth + padX);

    if (cursorX > startX && cursorX + width > startX + maxWidth) {
      cursorX = startX;
      cursorY += pillHeight + gapY;
    }

    const accent = accentKey ? theme.accents[accentKey] : null;
    const fill = accent ? theme.pillBg : theme.pillBg;
    const stroke = theme.pillBorder;
    const textFill = theme.pillText;
    const textY = cursorY + pillHeight / 2 + 3.6;

    parts.push(
      `<g>` +
        `<rect x="${cursorX}" y="${cursorY}" width="${width}" height="${pillHeight}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1"/>` +
        `<text x="${(cursorX + width / 2).toFixed(1)}" y="${textY.toFixed(1)}" text-anchor="middle" font-family="${FONT_MONO}" font-size="${fontSize}" font-weight="500" fill="${textFill}">${safeLabel}</text>` +
      `</g>`
    );

    cursorX += width + gapX;
  }

  return parts.join("\n    ");
}

export function renderCardDefs(idPrefix, theme, accentMain = null, accentSecondary = null) {
  const a1 = accentMain || theme.accents.indigo.main;
  const a2 = accentSecondary || theme.accents.cyan.main;
  return `
    <linearGradient id="${idPrefix}-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.cardStart}"/>
      <stop offset="100%" stop-color="${theme.cardEnd}"/>
    </linearGradient>
    <linearGradient id="${idPrefix}-sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${a1}" stop-opacity="0"/>
      <stop offset="35%" stop-color="${a1}" stop-opacity="0.75"/>
      <stop offset="65%" stop-color="${a2}" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="${a2}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${idPrefix}-brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.textPrimary}"/>
      <stop offset="58%" stop-color="${theme.textPrimary}"/>
      <stop offset="100%" stop-color="${a1}"/>
    </linearGradient>
  `;
}

export function renderCardShell(idPrefix, width, height, radius, theme, accentMain = null) {
  const sheenInset = Math.max(radius, 20);
  return `
    <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${radius}" fill="url(#${idPrefix}-bg)" stroke="${theme.border}" stroke-width="1"/>
    <line x1="${sheenInset}" y1="1.25" x2="${width - sheenInset}" y2="1.25" stroke="${accentMain ? `url(#${idPrefix}-sheen)` : theme.hairline}" stroke-width="1.2"/>
  `;
}
