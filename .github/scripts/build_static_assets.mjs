import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PROFILE_CONFIG,
  THEMES,
  FONT_SANS,
  FONT_MONO,
  escapeXml,
  renderPills,
  renderCardDefs,
  renderCardShell,
} from "./profile.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../..");
const ASSETS_DIR = path.join(ROOT_DIR, "assets");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeAsset(filename, svg) {
  const filePath = path.join(ASSETS_DIR, filename);
  fs.writeFileSync(filePath, `${svg.trim()}\n`, "utf8");
}

function iconPath(name, color) {
  switch (name) {
    case "layers":
      return `
        <path d="M12 3L3 7.5L12 12L21 7.5L12 3Z" stroke="${color}" stroke-width="1.7" stroke-linejoin="round" fill="none"/>
        <path d="M3 12L12 16.5L21 12" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M3 16.5L12 21L21 16.5" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      `;
    case "spark":
      return `
        <path d="M13 2L4.5 13.5H11.5L10.5 22L19.5 10.5H12.5L13 2Z" stroke="${color}" stroke-width="1.7" stroke-linejoin="round" fill="none"/>
      `;
    case "eye":
      return `
        <path d="M2.5 12C4.8 7.6 8.2 5.5 12 5.5C15.8 5.5 19.2 7.6 21.5 12C19.2 16.4 15.8 18.5 12 18.5C8.2 18.5 4.8 16.4 2.5 12Z" stroke="${color}" stroke-width="1.7" fill="none"/>
        <circle cx="12" cy="12" r="2.8" stroke="${color}" stroke-width="1.7" fill="none"/>
      `;
    case "cpu":
      return `
        <rect x="7" y="7" width="10" height="10" rx="2" stroke="${color}" stroke-width="1.7" fill="none"/>
        <path d="M9.5 3V6M14.5 3V6M9.5 18V21M14.5 18V21M3 9.5H6M3 14.5H6M18 9.5H21M18 14.5H21" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
      `;
    case "campus":
      return `
        <path d="M12 4L3 8.5L12 13L21 8.5L12 4Z" stroke="${color}" stroke-width="1.7" stroke-linejoin="round" fill="none"/>
        <path d="M6.5 10.6V16.2C6.5 17.8 9 19.2 12 19.2C15 19.2 17.5 17.8 17.5 16.2V10.6" stroke="${color}" stroke-width="1.7" stroke-linecap="round" fill="none"/>
      `;
    case "linkedin":
      return `
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="${color}" stroke-width="1.7" fill="none"/>
        <path d="M8 10.5V16.5M8 7.5V7.6M11.5 16.5V10.5M11.5 12.6C11.5 11.2 12.6 10.3 14 10.3C15.4 10.3 16.2 11.2 16.2 12.7V16.5" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      `;
    case "globe":
      return `
        <circle cx="12" cy="12" r="8.5" stroke="${color}" stroke-width="1.7" fill="none"/>
        <ellipse cx="12" cy="12" rx="3.8" ry="8.5" stroke="${color}" stroke-width="1.5" fill="none"/>
        <line x1="3.8" y1="12" x2="20.2" y2="12" stroke="${color}" stroke-width="1.5"/>
      `;
    case "mail":
      return `
        <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="${color}" stroke-width="1.7" fill="none"/>
        <path d="M4.2 7L12 13L19.8 7" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      `;
    case "github":
      return `
        <path d="M12 3.2C7.1 3.2 3.2 7.1 3.2 12C3.2 15.9 5.7 19.2 9.2 20.4C9.6 20.5 9.8 20.2 9.8 20V18.4C7.3 18.9 6.8 17.3 6.8 17.3C6.4 16.3 5.8 16 5.8 16C5 15.4 5.9 15.4 5.9 15.4C6.8 15.5 7.3 16.3 7.3 16.3C8.1 17.7 9.4 17.3 9.9 17.1C10 16.5 10.2 16.1 10.5 15.9C8.5 15.7 6.5 14.9 6.5 11.5C6.5 10.5 6.8 9.7 7.4 9.1C7.3 8.9 7 7.9 7.5 6.7C7.5 6.7 8.3 6.4 9.9 7.5C10.6 7.3 11.3 7.2 12 7.2C12.7 7.2 13.4 7.3 14.1 7.5C15.7 6.4 16.5 6.7 16.5 6.7C17 7.9 16.7 8.9 16.6 9.1C17.2 9.7 17.5 10.5 17.5 11.5C17.5 14.9 15.5 15.7 13.5 15.9C13.8 16.2 14.1 16.7 14.1 17.6V20C14.1 20.2 14.3 20.5 14.8 20.4C18.3 19.2 20.8 15.9 20.8 12C20.8 7.1 16.9 3.2 12 3.2Z" stroke="${color}" stroke-width="1.45" stroke-linejoin="round" fill="none"/>
      `;
    default:
      return `<circle cx="12" cy="12" r="5" stroke="${color}" stroke-width="1.7" fill="none"/>`;
  }
}

function buildHeroSvg(theme) {
  const id = `hero-${theme.mode}`;
  const indigo = theme.accents.indigo;
  const cyan = theme.accents.cyan;
  const emerald = theme.accents.emerald;
  const violet = theme.accents.violet;
  const pillText = escapeXml(PROFILE_CONFIG.statusPill);
  const pillWidth = Math.ceil(PROFILE_CONFIG.statusPill.length * 6.3 + 42);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 264" width="900" height="264" role="img" aria-label="${escapeXml(PROFILE_CONFIG.name)} Hero Banner">
  <defs>
    ${renderCardDefs(id, theme, indigo.main, cyan.main)}
    <pattern id="${id}-dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.05" fill="${theme.gridDot}"/>
    </pattern>
    <radialGradient id="${id}-mask-grad" cx="70%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="65%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <mask id="${id}-dots-mask">
      <rect width="900" height="264" fill="url(#${id}-mask-grad)"/>
    </mask>
    <filter id="${id}-blur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="42"/>
    </filter>
    <clipPath id="${id}-clip">
      <rect x="0.5" y="0.5" width="899" height="263" rx="18"/>
    </clipPath>
    <style>
      @keyframes floatA {
        0%, 100% { transform: translate(0px, 0px); }
        50% { transform: translate(-14px, 10px); }
      }
      @keyframes floatB {
        0%, 100% { transform: translate(0px, 0px); }
        50% { transform: translate(12px, -10px); }
      }
      @keyframes pulseDot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.45; transform: scale(0.85); }
      }
      @keyframes blinkCursor {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0.15; }
      }
      @keyframes ticker1 {
        0%, 28% { opacity: 1; }
        33%, 95% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes ticker2 {
        0%, 30% { opacity: 0; }
        35%, 61% { opacity: 1; }
        66%, 100% { opacity: 0; }
      }
      @keyframes ticker3 {
        0%, 63% { opacity: 0; }
        68%, 94% { opacity: 1; }
        99%, 100% { opacity: 0; }
      }
      .orb-a { animation: floatA 11s ease-in-out infinite; }
      .orb-b { animation: floatB 14s ease-in-out infinite; }
      .status-dot { transform-box: fill-box; transform-origin: center; animation: pulseDot 2.4s ease-in-out infinite; }
      .cursor-blink { animation: blinkCursor 1.1s step-end infinite; }
      .t-line-1 { animation: ticker1 12s ease-in-out infinite; }
      .t-line-2 { animation: ticker2 12s ease-in-out infinite; }
      .t-line-3 { animation: ticker3 12s ease-in-out infinite; }
    </style>
  </defs>

  <g clip-path="url(#${id}-clip)">
    <rect width="900" height="264" fill="url(#${id}-bg)"/>
    <rect width="900" height="264" fill="url(#${id}-dots)" mask="url(#${id}-dots-mask)"/>

    <circle class="orb-a" cx="760" cy="52" r="135" fill="${indigo.main}" opacity="${theme.orbAlpha}" filter="url(#${id}-blur)"/>
    <circle class="orb-b" cx="150" cy="238" r="115" fill="${cyan.main}" opacity="${theme.orbAlpha}" filter="url(#${id}-blur)"/>

    <!-- Geometric Constellation Motif -->
    <g transform="translate(650, 38)" opacity="0.88">
      <rect x="0" y="0" width="210" height="188" rx="14" fill="${theme.cellBg}" fill-opacity="0.55" stroke="${theme.border}" stroke-width="1"/>
      <circle cx="105" cy="94" r="68" fill="none" stroke="${indigo.stroke}" stroke-width="1" stroke-dasharray="4 4"/>
      <circle cx="105" cy="94" r="44" fill="none" stroke="${cyan.stroke}" stroke-width="1"/>
      <circle cx="105" cy="94" r="20" fill="${indigo.soft}" stroke="${indigo.main}" stroke-width="1.2"/>
      <path d="M52 54 L105 94 L162 60 M105 94 L152 138 M105 94 L60 134" stroke="${theme.borderStrong}" stroke-width="1.15" fill="none"/>
      <circle cx="52" cy="54" r="4.5" fill="${cyan.main}"/>
      <circle cx="162" cy="60" r="4.5" fill="${violet.main}"/>
      <circle cx="152" cy="138" r="4.5" fill="${emerald.main}"/>
      <circle cx="60" cy="134" r="4.5" fill="${indigo.main}"/>
      <circle cx="105" cy="94" r="5.5" fill="${theme.textPrimary}" stroke="${indigo.main}" stroke-width="2"/>
      <text x="16" y="23" font-family="${FONT_MONO}" font-size="9.5" fill="${theme.textMuted}" letter-spacing="0.08em">SYS // ARCHITECT</text>
      <text x="16" y="174" font-family="${FONT_MONO}" font-size="9.5" fill="${cyan.text}">DB → API → AI → UI</text>
    </g>

    <!-- Status Pill -->
    <g transform="translate(44, 34)">
      <rect x="0" y="0" width="${pillWidth}" height="26" rx="13" fill="${emerald.soft}" stroke="${emerald.stroke}" stroke-width="1"/>
      <circle class="status-dot" cx="15" cy="13" r="3.6" fill="${emerald.main}"/>
      <text x="27" y="16.8" font-family="${FONT_MONO}" font-size="10.2" font-weight="600" letter-spacing="0.06em" fill="${emerald.text}">${pillText}</text>
    </g>

    <!-- Main Identity -->
    <text x="44" y="108" font-family="${FONT_SANS}" font-size="40" font-weight="700" letter-spacing="-0.03em" fill="url(#${id}-brand)">${escapeXml(PROFILE_CONFIG.name)}</text>
    <text x="44" y="139" font-family="${FONT_SANS}" font-size="15" font-weight="400" fill="${theme.textSecondary}">Full-Stack Engineer crafting scalable web apps,</text>
    <text x="44" y="161" font-family="${FONT_SANS}" font-size="15" font-weight="400" fill="${theme.textSecondary}">SaaS products &amp; AI-powered experiences.</text>

    <!-- Animated Terminal Ticker -->
    <g transform="translate(44, 190)">
      <rect x="0" y="0" width="582" height="38" rx="9" fill="${theme.cellBg}" stroke="${theme.border}" stroke-width="1"/>
      <text x="14" y="23" font-family="${FONT_MONO}" font-size="12" font-weight="700" fill="${cyan.main}">&gt;</text>
      <rect class="cursor-blink" x="26" y="13" width="7" height="13" rx="1.5" fill="${indigo.main}"/>
      <text class="t-line-1" x="42" y="23" font-family="${FONT_MONO}" font-size="11.8" fill="${theme.textPrimary}">${escapeXml(PROFILE_CONFIG.tickerLines[0])}</text>
      <text class="t-line-2" x="42" y="23" font-family="${FONT_MONO}" font-size="11.8" fill="${theme.textPrimary}" opacity="0">${escapeXml(PROFILE_CONFIG.tickerLines[1])}</text>
      <text class="t-line-3" x="42" y="23" font-family="${FONT_MONO}" font-size="11.8" fill="${theme.textPrimary}" opacity="0">${escapeXml(PROFILE_CONFIG.tickerLines[2])}</text>
    </g>
  </g>

  <rect x="0.5" y="0.5" width="899" height="263" rx="18" fill="none" stroke="${theme.border}" stroke-width="1"/>
  <line x1="20" y1="1.25" x2="880" y2="1.25" stroke="url(#${id}-sheen)" stroke-width="1.2"/>
</svg>`;
}

function buildAboutSvg(theme) {
  const id = `about-${theme.mode}`;
  const indigo = theme.accents.indigo;
  const cyan = theme.accents.cyan;
  const emerald = theme.accents.emerald;

  // Render syntax-highlighted terminal lines
  const codeLinesSvg = PROFILE_CONFIG.terminalLines
    .map((tokens, idx) => {
      const y = 94 + idx * 21;
      const lineNum = String(idx + 1).padStart(2, "0");
      const tspans = tokens
        .map((tok) => `<tspan fill="${theme.syn[tok.kind]}">${escapeXml(tok.text)}</tspan>`)
        .join("");
      return `
      <text x="20" y="${y}" font-family="${FONT_MONO}" font-size="11.2" fill="${theme.textMuted}">${lineNum}</text>
      <text x="48" y="${y}" font-family="${FONT_MONO}" font-size="11.8" xml:space="preserve">${tspans}</text>`;
    })
    .join("");

  // Render 2x2 Engineering Pillars
  const pillarsSvg = PROFILE_CONFIG.pillars
    .map((p, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 540 + col * 174;
      const y = 44 + row * 46;
      const acc = theme.accents[p.accent];
      return `
      <g transform="translate(${x}, ${y})">
        <rect x="0" y="0" width="166" height="39" rx="9" fill="${theme.cellBg}" stroke="${theme.border}" stroke-width="1"/>
        <rect x="9" y="10" width="3" height="19" rx="1.5" fill="${acc.main}"/>
        <text x="19" y="17.5" font-family="${FONT_SANS}" font-size="11.6" font-weight="600" fill="${theme.textPrimary}">${escapeXml(p.title)}</text>
        <text x="19" y="31.5" font-family="${FONT_SANS}" font-size="10.2" fill="${theme.textSecondary}">${escapeXml(p.subtitle)}</text>
      </g>`;
    })
    .join("");

  // Render 3 Live Focus rows
  const focusSvg = PROFILE_CONFIG.focusItems
    .map((item, idx) => {
      const y = 204 + idx * 31;
      const acc = theme.accents[item.accent];
      const dotClass = item.pulse ? ` class="focus-pulse"` : "";
      return `
      <g transform="translate(540, ${y})">
        <rect x="0" y="0" width="342" height="25" rx="7" fill="${theme.cellBg}" stroke="${theme.border}" stroke-width="1"/>
        <circle${dotClass} cx="14" cy="12.5" r="3.2" fill="${acc.main}"/>
        <text x="25" y="16.3" font-family="${FONT_SANS}" font-size="11.6" font-weight="600" fill="${theme.textPrimary}">${escapeXml(item.title)}</text>
        <text x="331" y="16.1" text-anchor="end" font-family="${FONT_MONO}" font-size="10" fill="${acc.text}">${escapeXml(item.meta)}</text>
      </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 310" width="900" height="310" role="img" aria-label="About Banuja Kaushalya">
  <defs>
    ${renderCardDefs(`${id}-l`, theme, indigo.main, cyan.main)}
    ${renderCardDefs(`${id}-rt`, theme, cyan.main, indigo.main)}
    ${renderCardDefs(`${id}-rb`, theme, emerald.main, indigo.main)}
    <style>
      @keyframes blinkBlock {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0.15; }
      }
      @keyframes focusPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.35; }
      }
      .term-cursor { animation: blinkBlock 1.1s step-end infinite; }
      .focus-pulse { animation: focusPulse 2.2s ease-in-out infinite; }
    </style>
  </defs>

  <!-- Left Card: macOS TypeScript Terminal (w=506, h=310) -->
  <g>
    ${renderCardShell(`${id}-l`, 506, 310, 16, theme, indigo.main)}
    <!-- Window Chrome -->
    <circle cx="22" cy="19" r="4.5" fill="#ff5f57" opacity="0.85"/>
    <circle cx="37" cy="19" r="4.5" fill="#febc2e" opacity="0.85"/>
    <circle cx="52" cy="19" r="4.5" fill="#28c840" opacity="0.85"/>
    <text x="253" y="22.5" text-anchor="middle" font-family="${FONT_MONO}" font-size="11" fill="${theme.textMuted}">${escapeXml(PROFILE_CONFIG.terminalFile)}</text>
    <line x1="1" y1="37" x2="505" y2="37" stroke="${theme.divider}" stroke-width="1"/>

    <!-- Command Header -->
    <text x="20" y="62" font-family="${FONT_MONO}" font-size="11.5" font-weight="600" fill="${cyan.main}">~ $</text>
    <text x="48" y="62" font-family="${FONT_MONO}" font-size="11.5" fill="${theme.textSecondary}">${escapeXml(PROFILE_CONFIG.terminalCommand)}</text>

    <!-- Code Lines -->
    ${codeLinesSvg}

    <!-- Terminal Footer -->
    <line x1="16" y1="268" x2="490" y2="268" stroke="${theme.divider}" stroke-width="1"/>
    <circle cx="24" cy="288" r="3" fill="${emerald.main}"/>
    <text x="34" y="291.5" font-family="${FONT_MONO}" font-size="10.5" fill="${theme.textMuted}">TypeScript · Ready</text>
    <text x="434" y="291.5" font-family="${FONT_MONO}" font-size="10.5" fill="${theme.textMuted}">ready &gt;</text>
    <rect class="term-cursor" x="481" y="281.5" width="7" height="12" rx="1.5" fill="${indigo.main}"/>
  </g>

  <!-- Top-Right Card: Engineering Pillars (x=522, y=0, w=378, h=148) -->
  <g>
    <g transform="translate(522, 0)">
      ${renderCardShell(`${id}-rt`, 378, 148, 16, theme, cyan.main)}
    </g>
    <circle cx="544" cy="24" r="3.5" fill="${cyan.main}"/>
    <text x="555" y="27.5" font-family="${FONT_MONO}" font-size="10.8" font-weight="600" letter-spacing="0.08em" fill="${theme.textSecondary}">ENGINEERING PILLARS</text>
    ${pillarsSvg}
  </g>

  <!-- Bottom-Right Card: Currently Shipping (x=522, y=164, w=378, h=146) -->
  <g>
    <g transform="translate(522, 164)">
      ${renderCardShell(`${id}-rb`, 378, 146, 16, theme, emerald.main)}
    </g>
    <circle cx="544" cy="188" r="3.5" fill="${emerald.main}"/>
    <text x="555" y="191.5" font-family="${FONT_MONO}" font-size="10.8" font-weight="600" letter-spacing="0.08em" fill="${theme.textSecondary}">CURRENTLY SHIPPING</text>
    ${focusSvg}
  </g>
</svg>`;
}

function buildProjectCardSvg(project, theme) {
  const id = `proj-${project.id}-${theme.mode}`;
  const acc = theme.accents[project.accent];
  const badgeW = Math.ceil(project.badge.length * 6.2 + 26);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 196" width="440" height="196" role="img" aria-label="${escapeXml(project.title)}">
  <defs>
    ${renderCardDefs(id, theme, acc.main, theme.accents.indigo.main)}
  </defs>

  ${renderCardShell(id, 440, 196, 16, theme, acc.main)}

  <!-- Top Row: Icon Badge + Status Pill + Link Arrow -->
  <rect x="22" y="18" width="28" height="28" rx="8" fill="${acc.soft}" stroke="${acc.stroke}" stroke-width="1"/>
  <g transform="translate(24, 20) scale(1)">
    ${iconPath(project.icon, acc.main)}
  </g>

  <rect x="58" y="21" width="${badgeW}" height="22" rx="6" fill="${acc.soft}" stroke="${acc.stroke}" stroke-width="1"/>
  <circle cx="69" cy="32" r="2.8" fill="${acc.main}"/>
  <text x="77" y="35.4" font-family="${FONT_MONO}" font-size="9.8" font-weight="600" letter-spacing="0.06em" fill="${acc.text}">${escapeXml(project.badge)}</text>

  <g transform="translate(394, 20)">
    <rect x="0" y="0" width="24" height="24" rx="7" fill="${theme.cellBg}" stroke="${theme.border}" stroke-width="1"/>
    <path d="M8.5 15.5L15.5 8.5M15.5 8.5H10M15.5 8.5V14" stroke="${theme.textSecondary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>

  <!-- Title & Description -->
  <text x="22" y="74" font-family="${FONT_SANS}" font-size="16" font-weight="700" letter-spacing="-0.015em" fill="${theme.textPrimary}">${escapeXml(project.title)}</text>
  <text x="22" y="98" font-family="${FONT_SANS}" font-size="12.5" fill="${theme.textSecondary}">${escapeXml(project.description[0])}</text>
  <text x="22" y="117" font-family="${FONT_SANS}" font-size="12.5" fill="${theme.textSecondary}">${escapeXml(project.description[1])}</text>

  <!-- Hairline Divider -->
  <line x1="22" y1="136" x2="418" y2="136" stroke="${theme.divider}" stroke-width="1"/>

  <!-- Tech Tags -->
  ${renderPills(project.tags, 22, 150, 396, theme, {
    pillHeight: 24,
    gapX: 6,
    fontSize: 10.5,
    charWidth: 5.9,
    padX: 16,
  })}
</svg>`;
}

function buildSpotlightProjectSvg(project, theme) {
  const id = `proj-${project.id}-${theme.mode}`;
  const acc = theme.accents[project.accent];
  const badgeW = Math.ceil(project.badge.length * 6.2 + 26);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 88" width="900" height="88" role="img" aria-label="${escapeXml(project.title)}">
  <defs>
    ${renderCardDefs(id, theme, acc.main, theme.accents.cyan.main)}
  </defs>

  ${renderCardShell(id, 900, 88, 16, theme, acc.main)}

  <rect x="22" y="25" width="38" height="38" rx="10" fill="${acc.soft}" stroke="${acc.stroke}" stroke-width="1"/>
  <g transform="translate(29, 32)">
    ${iconPath("campus", acc.main)}
  </g>

  <text x="74" y="38" font-family="${FONT_SANS}" font-size="16" font-weight="700" letter-spacing="-0.015em" fill="${theme.textPrimary}">${escapeXml(project.title)}</text>
  <rect x="176" y="22" width="${badgeW}" height="21" rx="6" fill="${acc.soft}" stroke="${acc.stroke}" stroke-width="1"/>
  <circle cx="187" cy="32.5" r="2.8" fill="${acc.main}"/>
  <text x="195" y="35.8" font-family="${FONT_MONO}" font-size="9.6" font-weight="600" letter-spacing="0.06em" fill="${acc.text}">${escapeXml(project.badge)}</text>

  <text x="74" y="61" font-family="${FONT_SANS}" font-size="12.5" fill="${theme.textSecondary}">${escapeXml(project.description)}</text>

  ${renderPills(project.tags, 678, 32, 178, theme, {
    pillHeight: 24,
    gapX: 6,
    fontSize: 10.5,
    charWidth: 5.9,
    padX: 16,
  })}

  <g transform="translate(854, 32)">
    <rect x="0" y="0" width="24" height="24" rx="7" fill="${theme.cellBg}" stroke="${theme.border}" stroke-width="1"/>
    <path d="M8.5 15.5L15.5 8.5M15.5 8.5H10M15.5 8.5V14" stroke="${theme.textSecondary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
</svg>`;
}

function buildTechStackSvg(theme) {
  const id = `stack-${theme.mode}`;
  const cells = PROFILE_CONFIG.techStack
    .map((group, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col * 458;
      const y = row * 151;
      const acc = theme.accents[group.accent];
      const cellId = `${id}-${idx}`;
      const countStr = String(group.items.length).padStart(2, "0");

      return `
      <g>
        <g transform="translate(${x}, ${y})">
          ${renderCardShell(cellId, 442, 135, 16, theme, acc.main)}
        </g>
        <circle cx="${x + 24}" cy="${y + 24}" r="3.6" fill="${acc.main}"/>
        <text x="${x + 36}" y="${y + 27.5}" font-family="${FONT_MONO}" font-size="11" font-weight="600" letter-spacing="0.08em" fill="${theme.textSecondary}">${escapeXml(group.category)}</text>
        <rect x="${x + 394}" y="${y + 14}" width="26" height="19" rx="6" fill="${acc.soft}" stroke="${acc.stroke}" stroke-width="1"/>
        <text x="${x + 407}" y="${y + 27}" text-anchor="middle" font-family="${FONT_MONO}" font-size="10" font-weight="600" fill="${acc.text}">${countStr}</text>
        <line x1="${x + 22}" y1="${y + 42}" x2="${x + 420}" y2="${y + 42}" stroke="${theme.divider}" stroke-width="1"/>
        ${renderPills(group.items, x + 22, y + 54, 398, theme, {
          pillHeight: 26,
          gapX: 8,
          gapY: 9,
          fontSize: 11.2,
          charWidth: 6.3,
          padX: 18,
        })}
      </g>`;
    })
    .join("");

  const defs = PROFILE_CONFIG.techStack
    .map((group, idx) =>
      renderCardDefs(
        `${id}-${idx}`,
        theme,
        theme.accents[group.accent].main,
        theme.accents.indigo.main
      )
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 286" width="900" height="286" role="img" aria-label="Tech Stack Matrix">
  <defs>${defs}</defs>
  ${cells}
</svg>`;
}

function buildSnakePreviewSvg(theme) {
  const id = `snake-${theme.mode}`;
  const indigo = theme.accents.indigo;
  const cyan = theme.accents.cyan;

  const palette =
    theme.mode === "dark"
      ? ["#161b22", "#1e1b4b", "#3730a3", "#6366f1", "#22d3ee"]
      : ["#eef2ff", "#c7d2fe", "#a5b4fc", "#4f46e5", "#06b6d4"];

  const cols = 52;
  const rows = 7;
  const startX = 62;
  const startY = 48;
  const pitch = 15;
  const cells = [];

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const hash = (c * 31 + r * 17 + (c % 5) * 7) % 19;
      let level = 0;
      if (hash > 15) level = 4;
      else if (hash > 12) level = 3;
      else if (hash > 8) level = 2;
      else if (hash > 4) level = 1;
      const x = startX + c * pitch;
      const y = startY + r * pitch;
      cells.push(
        `<rect x="${x}" y="${y}" width="11" height="11" rx="2.5" fill="${palette[level]}"/>`
      );
    }
  }

  const snakeBody = [
    [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [10, 3], [10, 4], [11, 4], [12, 4],
    [13, 4], [14, 4], [14, 3], [14, 2], [14, 1], [15, 1], [16, 1], [17, 1],
  ];
  const snakeOverlay = snakeBody
    .map(([col, row], idx) => {
      const x = startX + col * pitch;
      const y = startY + row * pitch;
      const isHead = idx === snakeBody.length - 1;
      const opacity = (0.35 + ((idx + 1) / snakeBody.length) * 0.65).toFixed(2);
      const fill = isHead ? cyan.main : indigo.main;
      return `<rect x="${x}" y="${y}" width="11" height="11" rx="2.5" fill="${fill}" opacity="${opacity}"/>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 164" width="900" height="164" role="img" aria-label="Contribution Snake">
  <defs>
    ${renderCardDefs(id, theme, indigo.main, cyan.main)}
    <style>
      @keyframes snakePulse {
        0%, 100% { opacity: 0.95; }
        50% { opacity: 0.65; }
      }
      .snake-body { animation: snakePulse 3s ease-in-out infinite; }
    </style>
  </defs>

  ${renderCardShell(id, 900, 164, 16, theme, indigo.main)}

  <circle cx="24" cy="24" r="3.5" fill="${cyan.main}"/>
  <text x="36" y="27.5" font-family="${FONT_MONO}" font-size="11" font-weight="600" letter-spacing="0.08em" fill="${theme.textSecondary}">CONTRIBUTION SNAKE</text>
  <rect x="694" y="13" width="184" height="22" rx="6" fill="${indigo.soft}" stroke="${indigo.stroke}" stroke-width="1"/>
  <text x="786" y="27.2" text-anchor="middle" font-family="${FONT_MONO}" font-size="9.8" font-weight="600" fill="${indigo.text}">AUTO-SYNCED · GITHUB ACTIONS</text>

  <g>${cells.join("")}</g>
  <g class="snake-body">${snakeOverlay}</g>
</svg>`;
}

function buildSocialButtonSvg(social, theme) {
  const id = `soc-${social.id}-${theme.mode}`;
  const acc = theme.accents[social.accent];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 40" width="176" height="40" role="img" aria-label="${escapeXml(social.label)}">
  <defs>
    ${renderCardDefs(id, theme, acc.main, theme.accents.indigo.main)}
  </defs>
  ${renderCardShell(id, 176, 40, 10, theme, acc.main)}
  <rect x="9" y="8" width="24" height="24" rx="6" fill="${acc.soft}" stroke="${acc.stroke}" stroke-width="1"/>
  <g transform="translate(12, 11) scale(0.75)">
    ${iconPath(social.icon, acc.main)}
  </g>
  <text x="42" y="24" font-family="${FONT_SANS}" font-size="13" font-weight="600" fill="${theme.textPrimary}">${escapeXml(social.label)}</text>
  <path d="M153 24L159 18M159 18H154.2M159 18V22.8" stroke="${theme.textMuted}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;
}

function buildFooterSvg(theme) {
  const id = `footer-${theme.mode}`;
  const indigo = theme.accents.indigo;
  const cyan = theme.accents.cyan;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 124" width="900" height="124" role="img" aria-label="Quote by Napoleon Bonaparte">
  <defs>
    ${renderCardDefs(id, theme, indigo.main, cyan.main)}
    <radialGradient id="${id}-glow" cx="50%" cy="100%" r="70%">
      <stop offset="0%" stop-color="${indigo.main}" stop-opacity="${theme.mode === "dark" ? "0.14" : "0.08"}"/>
      <stop offset="100%" stop-color="${indigo.main}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  ${renderCardShell(id, 900, 124, 16, theme, indigo.main)}
  <rect x="1" y="1" width="898" height="122" rx="16" fill="url(#${id}-glow)"/>

  <text x="450" y="47" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="16" font-style="italic" fill="${theme.textPrimary}">&#8220;${escapeXml(PROFILE_CONFIG.quote)}&#8221;</text>
  <text x="450" y="75" text-anchor="middle" font-family="${FONT_MONO}" font-size="10.8" font-weight="600" letter-spacing="0.14em" fill="${theme.textSecondary}">— ${escapeXml(PROFILE_CONFIG.quoteAuthor.toUpperCase())}</text>

  <rect x="402" y="94" width="96" height="2.4" rx="1.2" fill="url(#${id}-sheen)"/>
</svg>`;
}

function main() {
  ensureDir(ASSETS_DIR);

  for (const mode of ["dark", "light"]) {
    const theme = THEMES[mode];
    writeAsset(`hero-${mode}.svg`, buildHeroSvg(theme));
    writeAsset(`about-${mode}.svg`, buildAboutSvg(theme));

    for (const proj of PROFILE_CONFIG.projects) {
      writeAsset(`project-${proj.id}-${mode}.svg`, buildProjectCardSvg(proj, theme));
    }

    writeAsset(
      `project-${PROFILE_CONFIG.spotlightProject.id}-${mode}.svg`,
      buildSpotlightProjectSvg(PROFILE_CONFIG.spotlightProject, theme)
    );
    writeAsset(`tech-stack-${mode}.svg`, buildTechStackSvg(theme));
    writeAsset(`snake-${mode}.svg`, buildSnakePreviewSvg(theme));

    for (const social of PROFILE_CONFIG.socials) {
      writeAsset(`social-${social.id}-${mode}.svg`, buildSocialButtonSvg(social, theme));
    }

    writeAsset(`footer-${mode}.svg`, buildFooterSvg(theme));
  }

  console.log("Static SVG assets generated cleanly in ./assets/");
}

main();
