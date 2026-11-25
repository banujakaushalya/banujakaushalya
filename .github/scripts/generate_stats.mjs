import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PROFILE_CONFIG,
  THEMES,
  FONT_SANS,
  FONT_MONO,
  escapeXml,
  renderCardDefs,
  renderCardShell,
} from "./profile.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../..");
const ASSETS_DIR = path.join(ROOT_DIR, "assets");

const DEFAULT_LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  PHP: "#4F5D95",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Other: "#64748b",
};

const GRAPHQL_QUERY = `
query ($login: String!) {
  user(login: $login) {
    createdAt
    followers {
      totalCount
    }
    pullRequests(states: [OPEN, CLOSED, MERGED]) {
      totalCount
    }
    issues {
      totalCount
    }
    repositories(
      ownerAffiliations: OWNER
      isFork: false
      first: 100
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      totalCount
      nodes {
        stargazerCount
        isPrivate
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

function buildSeedMetrics() {
  const today = new Date();
  const sampleCounts = [
    1, 2, 0, 3, 4, 2, 1, 5, 3, 2, 0, 1, 4, 6, 3, 2, 4, 5, 1, 2, 3, 7, 4, 3, 2,
    5, 6, 4, 3, 5,
  ];
  const last30Days = sampleCounts.map((count, idx) => {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - (29 - idx));
    return {
      date: d.toISOString().slice(0, 10),
      contributionCount: count,
    };
  });

  return {
    isSeed: true,
    syncedLabel: "SAMPLE SEED · RUN ACTION FOR LIVE DATA",
    totalContributions: 96,
    currentStreak: 10,
    longestStreak: 14,
    repoCount: 5,
    stars: 0,
    pullRequests: 0,
    issues: 0,
    followers: 1,
    languages: [
      { name: "JavaScript", color: "#f1e05a", percent: 38.4 },
      { name: "PHP", color: "#4F5D95", percent: 29.2 },
      { name: "Python", color: "#3572A5", percent: 18.6 },
      { name: "HTML", color: "#e34c26", percent: 8.8 },
      { name: "CSS", color: "#563d7c", percent: 5.0 },
    ],
    last30Days,
  };
}

function computeStreaks(days) {
  let longest = 0;
  let running = 0;
  for (const day of days) {
    if (day.contributionCount > 0) {
      running += 1;
      if (running > longest) longest = running;
    } else {
      running = 0;
    }
  }

  let current = 0;
  if (days.length > 0) {
    let idx = days.length - 1;
    if (days[idx].contributionCount === 0 && idx > 0) {
      idx -= 1;
    }
    while (idx >= 0 && days[idx].contributionCount > 0) {
      current += 1;
      idx -= 1;
    }
  }

  return { currentStreak: current, longestStreak: longest };
}

function computeTopLanguages(repoNodes) {
  const totals = new Map();
  let grandTotal = 0;

  for (const repo of repoNodes) {
    const edges = repo?.languages?.edges || [];
    for (const edge of edges) {
      const name = edge?.node?.name;
      const size = Number(edge?.size || 0);
      if (!name || size <= 0) continue;
      const prev = totals.get(name) || {
        name,
        color: edge.node.color || DEFAULT_LANG_COLORS[name] || "#818cf8",
        size: 0,
      };
      prev.size += size;
      totals.set(name, prev);
      grandTotal += size;
    }
  }

  if (grandTotal === 0) {
    return [
      { name: "JavaScript", color: "#f1e05a", percent: 40 },
      { name: "Python", color: "#3572A5", percent: 30 },
      { name: "PHP", color: "#4F5D95", percent: 30 },
    ];
  }

  const sorted = Array.from(totals.values()).sort((a, b) => b.size - a.size);
  const top = sorted.slice(0, 5);
  const restSize = sorted.slice(5).reduce((acc, item) => acc + item.size, 0);

  if (restSize > 0) {
    top.push({
      name: "Other",
      color: DEFAULT_LANG_COLORS.Other,
      size: restSize,
    });
  }

  return top.map((lang) => ({
    name: lang.name,
    color: lang.color,
    percent: Number(((lang.size / grandTotal) * 100).toFixed(1)),
  }));
}

async function fetchLiveMetrics(username, token) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "banujakaushalya-profile-stats",
    },
    body: JSON.stringify({
      query: GRAPHQL_QUERY,
      variables: { login: username },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join("; "));
  }

  const user = payload.data?.user;
  if (!user) {
    throw new Error(`User "${username}" not found`);
  }

  const calendar = user.contributionsCollection.contributionCalendar;
  const allDays = calendar.weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date));

  const { currentStreak, longestStreak } = computeStreaks(allDays);
  const last30Days = allDays.slice(-30);
  const repoNodes = user.repositories?.nodes || [];
  const stars = repoNodes.reduce((sum, r) => sum + (r.stargazerCount || 0), 0);
  const languages = computeTopLanguages(repoNodes);
  const nowDate = new Date().toISOString().slice(0, 10);

  return {
    isSeed: false,
    syncedLabel: `LIVE SYNC · ${nowDate} UTC`,
    totalContributions: calendar.totalContributions,
    currentStreak,
    longestStreak,
    repoCount: user.repositories?.totalCount || repoNodes.length,
    stars,
    pullRequests: user.pullRequests?.totalCount || 0,
    issues: user.issues?.totalCount || 0,
    followers: user.followers?.totalCount || 0,
    languages,
    last30Days,
  };
}

function buildSmoothAreaPaths(points, topY, baselineY) {
  if (points.length === 0) return { linePath: "", areaPath: "" };
  if (points.length === 1) {
    const p = points[0];
    return {
      linePath: `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
      areaPath: `M ${p.x.toFixed(1)} ${baselineY} L ${p.x.toFixed(1)} ${p.y.toFixed(1)} L ${p.x.toFixed(1)} ${baselineY} Z`,
    };
  }

  const clampY = (val) => Math.max(topY, Math.min(baselineY, val));
  let linePath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = clampY(p1.y + (p2.y - p0.y) / 6);
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = clampY(p2.y - (p3.y - p1.y) / 6);

    linePath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  const first = points[0];
  const last = points[points.length - 1];
  const areaPath = `${linePath} L ${last.x.toFixed(1)} ${baselineY.toFixed(1)} L ${first.x.toFixed(1)} ${baselineY.toFixed(1)} Z`;

  return { linePath, areaPath };
}

function formatShortDate(iso) {
  const [, month, day] = iso.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[Number(month) - 1] || month} ${Number(day)}`;
}

function buildStatsSvg(metrics, theme) {
  const id = `stats-${theme.mode}`;
  const indigo = theme.accents.indigo;
  const cyan = theme.accents.cyan;
  const emerald = theme.accents.emerald;
  const violet = theme.accents.violet;

  // 1. Top-Left KPI Cards (472x180)
  const kpis = [
    {
      label: "CONTRIBUTIONS",
      value: String(metrics.totalContributions),
      sub: "Last 12 months",
      accent: indigo,
    },
    {
      label: "CURRENT STREAK",
      value: `${metrics.currentStreak}d`,
      sub: `Best: ${metrics.longestStreak}d`,
      accent: emerald,
    },
    {
      label: "REPOSITORIES",
      value: String(metrics.repoCount),
      sub: `${metrics.followers} follower${metrics.followers === 1 ? "" : "s"}`,
      accent: cyan,
    },
    {
      label: "PRS & STARS",
      value: `${metrics.pullRequests} · ★${metrics.stars}`,
      sub: `Issues: ${metrics.issues}`,
      accent: violet,
    },
  ];

  const kpiSvg = kpis
    .map((k, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 20 + col * 222;
      const y = 44 + row * 64;
      return `
      <g transform="translate(${x}, ${y})">
        <rect x="0" y="0" width="210" height="54" rx="10" fill="${theme.cellBg}" stroke="${theme.border}" stroke-width="1"/>
        <rect x="10" y="12" width="3" height="30" rx="1.5" fill="${k.accent.main}"/>
        <text x="22" y="21" font-family="${FONT_MONO}" font-size="9.5" font-weight="600" letter-spacing="0.06em" fill="${theme.textMuted}">${escapeXml(k.label)}</text>
        <text x="22" y="42" font-family="${FONT_SANS}" font-size="18.5" font-weight="700" fill="${theme.textPrimary}">${escapeXml(k.value)}</text>
        <text x="198" y="41" text-anchor="end" font-family="${FONT_MONO}" font-size="9.8" fill="${theme.textSecondary}">${escapeXml(k.sub)}</text>
      </g>`;
    })
    .join("");

  // 2. Top-Right Languages Bar + 2-column Legend (x=488, w=412, h=180)
  const barWidth = 368;
  let segCursor = 510;
  const barSegments = metrics.languages
    .map((lang, idx) => {
      const isLast = idx === metrics.languages.length - 1;
      const w = isLast
        ? Math.max(0, 510 + barWidth - segCursor)
        : Math.max(3, (lang.percent / 100) * barWidth);
      const rect = `<rect x="${segCursor.toFixed(1)}" y="50" width="${w.toFixed(1)}" height="10" fill="${escapeXml(lang.color)}"/>`;
      segCursor += w;
      return rect;
    })
    .join("");

  const legendSvg = metrics.languages
    .slice(0, 6)
    .map((lang, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 510 + col * 192;
      const y = 84 + row * 28;
      return `
      <g transform="translate(${x}, ${y})">
        <rect x="0" y="0" width="176" height="22" rx="6" fill="${theme.cellBg}" stroke="${theme.border}" stroke-width="1"/>
        <circle cx="13" cy="11" r="4" fill="${escapeXml(lang.color)}"/>
        <text x="24" y="14.8" font-family="${FONT_SANS}" font-size="11.5" font-weight="600" fill="${theme.textPrimary}">${escapeXml(lang.name)}</text>
        <text x="166" y="14.5" text-anchor="end" font-family="${FONT_MONO}" font-size="10.5" fill="${theme.textSecondary}">${lang.percent.toFixed(1)}%</text>
      </g>`;
    })
    .join("");

  // 3. Bottom 30-Day Activity Graph (x=0, y=196, w=900, h=170)
  const days = metrics.last30Days;
  const maxCount = Math.max(4, ...days.map((d) => d.contributionCount));
  const chartLeft = 46;
  const chartRight = 874;
  const chartTop = 250;
  const chartBottom = 330;
  const chartW = chartRight - chartLeft;
  const chartH = chartBottom - chartTop;

  const points = days.map((d, idx) => {
    const x =
      days.length > 1
        ? chartLeft + (idx / (days.length - 1)) * chartW
        : chartLeft + chartW / 2;
    const y = chartBottom - (d.contributionCount / maxCount) * chartH;
    return { x, y, count: d.contributionCount, date: d.date };
  });

  const { linePath, areaPath } = buildSmoothAreaPaths(
    points,
    chartTop,
    chartBottom
  );
  const lastPt = points[points.length - 1] || { x: chartRight, y: chartBottom };
  const peakCount = Math.max(...days.map((d) => d.contributionCount));
  const midLabel = Math.round(maxCount / 2);

  const startLabel = days[0] ? formatShortDate(days[0].date) : "30d ago";
  const midDateLabel = days[14] ? formatShortDate(days[14].date) : "15d ago";
  const endLabel = days[days.length - 1]
    ? formatShortDate(days[days.length - 1].date)
    : "Today";

  const syncBadgeW = Math.ceil(metrics.syncedLabel.length * 5.8 + 20);
  const peakText = `PEAK: ${peakCount}/DAY`;
  const peakBadgeW = Math.ceil(peakText.length * 6.0 + 18);
  const syncBadgeX = 878 - syncBadgeW;
  const peakBadgeX = syncBadgeX - 8 - peakBadgeW;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 366" width="900" height="366" role="img" aria-label="GitHub Analytics Dashboard">
  <defs>
    ${renderCardDefs(`${id}-tl`, theme, indigo.main, cyan.main)}
    ${renderCardDefs(`${id}-tr`, theme, violet.main, cyan.main)}
    ${renderCardDefs(`${id}-bm`, theme, cyan.main, indigo.main)}
    <clipPath id="${id}-lang-bar">
      <rect x="510" y="50" width="${barWidth}" height="10" rx="5"/>
    </clipPath>
    <linearGradient id="${id}-line-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${indigo.main}"/>
      <stop offset="100%" stop-color="${cyan.main}"/>
    </linearGradient>
    <linearGradient id="${id}-area-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${indigo.main}" stop-opacity="${theme.mode === "dark" ? "0.34" : "0.22"}"/>
      <stop offset="70%" stop-color="${cyan.main}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${cyan.main}" stop-opacity="0"/>
    </linearGradient>
    <style>
      @keyframes liveHalo {
        0%, 100% { r: 6; opacity: 0.45; }
        50% { r: 10; opacity: 0.1; }
      }
      .live-halo { animation: liveHalo 2.4s ease-in-out infinite; }
    </style>
  </defs>

  <!-- Top-Left Card: GitHub Overview & Streak -->
  <g>
    ${renderCardShell(`${id}-tl`, 472, 180, 16, theme, indigo.main)}
    <circle cx="24" cy="24" r="3.5" fill="${indigo.main}"/>
    <text x="36" y="27.5" font-family="${FONT_MONO}" font-size="10.8" font-weight="600" letter-spacing="0.08em" fill="${theme.textSecondary}">GITHUB OVERVIEW &amp; STREAK</text>
    ${kpiSvg}
  </g>

  <!-- Top-Right Card: Top Languages -->
  <g>
    <g transform="translate(488, 0)">
      ${renderCardShell(`${id}-tr`, 412, 180, 16, theme, violet.main)}
    </g>
    <circle cx="512" cy="24" r="3.5" fill="${violet.main}"/>
    <text x="524" y="27.5" font-family="${FONT_MONO}" font-size="10.8" font-weight="600" letter-spacing="0.08em" fill="${theme.textSecondary}">TOP LANGUAGES</text>
    <text x="878" y="27.5" text-anchor="end" font-family="${FONT_MONO}" font-size="10" fill="${theme.textMuted}">BY CODE VOLUME</text>

    <rect x="510" y="50" width="${barWidth}" height="10" rx="5" fill="${theme.cellBg}"/>
    <g clip-path="url(#${id}-lang-bar)">
      ${barSegments}
    </g>
    ${legendSvg}
  </g>

  <!-- Bottom Card: 30-Day Activity Graph -->
  <g>
    <g transform="translate(0, 196)">
      ${renderCardShell(`${id}-bm`, 900, 170, 16, theme, cyan.main)}
    </g>
    <circle cx="24" cy="220" r="3.5" fill="${cyan.main}"/>
    <text x="36" y="223.5" font-family="${FONT_MONO}" font-size="10.8" font-weight="600" letter-spacing="0.08em" fill="${theme.textSecondary}">30-DAY ACTIVITY GRAPH</text>

    <rect x="${peakBadgeX}" y="209" width="${peakBadgeW}" height="21" rx="6" fill="${cyan.soft}" stroke="${cyan.stroke}" stroke-width="1"/>
    <text x="${(peakBadgeX + peakBadgeW / 2).toFixed(1)}" y="222.5" text-anchor="middle" font-family="${FONT_MONO}" font-size="9.5" font-weight="600" fill="${cyan.text}">${escapeXml(peakText)}</text>

    <rect x="${syncBadgeX}" y="209" width="${syncBadgeW}" height="21" rx="6" fill="${indigo.soft}" stroke="${indigo.stroke}" stroke-width="1"/>
    <text x="${(syncBadgeX + syncBadgeW / 2).toFixed(1)}" y="222.5" text-anchor="middle" font-family="${FONT_MONO}" font-size="9.5" font-weight="600" fill="${indigo.text}">${escapeXml(metrics.syncedLabel)}</text>

    <!-- Gridlines & Y-Axis -->
    <line x1="${chartLeft}" y1="${chartTop}" x2="${chartRight}" y2="${chartTop}" stroke="${theme.divider}" stroke-width="1" stroke-dasharray="3 4"/>
    <line x1="${chartLeft}" y1="${(chartTop + chartBottom) / 2}" x2="${chartRight}" y2="${(chartTop + chartBottom) / 2}" stroke="${theme.divider}" stroke-width="1" stroke-dasharray="3 4"/>
    <line x1="${chartLeft}" y1="${chartBottom}" x2="${chartRight}" y2="${chartBottom}" stroke="${theme.divider}" stroke-width="1"/>

    <text x="38" y="${chartTop + 3.5}" text-anchor="end" font-family="${FONT_MONO}" font-size="9.5" fill="${theme.textMuted}">${maxCount}</text>
    <text x="38" y="${(chartTop + chartBottom) / 2 + 3.5}" text-anchor="end" font-family="${FONT_MONO}" font-size="9.5" fill="${theme.textMuted}">${midLabel}</text>
    <text x="38" y="${chartBottom + 3.5}" text-anchor="end" font-family="${FONT_MONO}" font-size="9.5" fill="${theme.textMuted}">0</text>

    <!-- Area + Curve + Live Dot -->
    <path d="${areaPath}" fill="url(#${id}-area-grad)"/>
    <path d="${linePath}" fill="none" stroke="url(#${id}-line-grad)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="live-halo" cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="6" fill="${cyan.main}" opacity="0.35"/>
    <circle cx="${lastPt.x.toFixed(1)}" cy="${lastPt.y.toFixed(1)}" r="3.8" fill="${theme.textPrimary}" stroke="${cyan.main}" stroke-width="2"/>

    <!-- X-Axis Labels -->
    <text x="${chartLeft}" y="350" font-family="${FONT_MONO}" font-size="9.8" fill="${theme.textMuted}">${escapeXml(startLabel)}</text>
    <text x="${((chartLeft + chartRight) / 2).toFixed(1)}" y="350" text-anchor="middle" font-family="${FONT_MONO}" font-size="9.8" fill="${theme.textMuted}">${escapeXml(midDateLabel)}</text>
    <text x="${chartRight}" y="350" text-anchor="end" font-family="${FONT_MONO}" font-size="9.8" fill="${theme.textMuted}">${escapeXml(endLabel)}</text>
  </g>
</svg>`;
}

async function main() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const useSeedFlag = process.argv.includes("--seed");
  const username = process.env.GH_USERNAME || PROFILE_CONFIG.username;
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";

  let metrics;
  if (useSeedFlag || !token) {
    metrics = buildSeedMetrics();
    console.log("Generated analytics cards using local seed preview.");
  } else {
    try {
      metrics = await fetchLiveMetrics(username, token);
      console.log(`Fetched live GitHub metrics for @${username}.`);
    } catch (err) {
      console.warn(`Live fetch failed (${err.message}); falling back to seed.`);
      metrics = buildSeedMetrics();
    }
  }

  for (const mode of ["dark", "light"]) {
    const svg = buildStatsSvg(metrics, THEMES[mode]);
    fs.writeFileSync(
      path.join(ASSETS_DIR, `stats-${mode}.svg`),
      `${svg.trim()}\n`,
      "utf8"
    );
  }
}

main();
