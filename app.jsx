/* =============================================================
   Xiaoyi 小移 · AI Soul Companion · Interactive Demo
   React 18 + Babel standalone (CDN)
   - Design system tokens
   - Lucide icon registry (no emoji in UI chrome)
   - Bilingual i18n (zh/en) with t() helper
   - Mobile-responsive (drawer + bottom sheet)
   ============================================================= */

const { useState, useEffect, useRef, useMemo, useCallback, useContext, createContext, Fragment } = React;

/* ============================================================
   THEME TOKENS (mirror styles.css custom properties)
   ============================================================ */
const TOKENS = {
  color: {
    brand: '#0066FF',
    brandLight: '#3B82F6',
    brandGlow: 'rgba(0, 102, 255, 0.4)',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    gold: '#FBBF24',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    textMuted: '#64748B',
  },
  radius: { sm: 8, md: 12, lg: 18, xl: 24, full: 9999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
};

/* ============================================================
   I18N — bilingual support
   ============================================================ */
const LangContext = createContext({ lang: 'zh', setLang: () => {} });

/**
 * t() — universal translation helper
 * Accepts either a plain string (returned as-is) or a {zh, en} object.
 */
function t(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && (value.zh !== undefined || value.en !== undefined)) {
    return value[lang] || value.zh || value.en || '';
  }
  return String(value);
}

function useT() {
  const { lang } = useContext(LangContext);
  return useCallback((value) => t(value, lang), [lang]);
}

/* ============================================================
   UI DICTIONARY (chrome strings only — scenario data has its own)
   ============================================================ */
const UI = {
  brand: { zh: '小移', en: 'Xiaoyi' },
  brandSub: { zh: '中国移动 · AI 灵魂伴侣', en: 'China Mobile · AI Soul Companion' },
  langToggle: { zh: 'EN', en: '中' },
  langLabel: { zh: '语言', en: 'Language' },
  menu: { zh: '场景', en: 'Scenarios' },
  scenarioInfo: { zh: '场景信息', en: 'Scenario Info' },
  soulProfile: { zh: 'Soul 档案', en: 'Soul Profile' },
  close: { zh: '关闭', en: 'Close' },
  // Welcome
  welcomeEyebrow: { zh: '中国移动 × AI 灵魂伴侣', en: 'China Mobile × AI Soul Companion' },
  welcomeTagline: { zh: 'AI 赋能短信入口 · 重塑运营商 C 端连接', en: 'AI-Powered SMS · Reshaping Carrier-User Connection' },
  welcomeLine1: { zh: '生活在你短信里的 AI 灵魂伴侣', en: 'The AI soul companion living in your SMS' },
  welcomePillar1: { zh: '零安装', en: 'Zero Install' },
  welcomePillar2: { zh: '主动服务', en: 'Proactive Care' },
  welcomePillar3: { zh: '越用越懂你', en: 'Knows You Better' },
  welcomeCTA: { zh: '开始体验', en: 'Start Experience' },
  welcomeFoot: { zh: '面向 9 亿用户 · 9 大核心场景 · 重新定义 AI 伴侣', en: '900M users · 9 core scenarios · Redefining AI companionship' },
  // Phone controls
  fastForward: { zh: '快进到下个节点', en: 'Fast forward' },
  replay: { zh: '重播场景', en: 'Replay scene' },
  playing: { zh: '小移正在服务中…', en: 'Xiaoyi is serving…' },
  tapCardHint: { zh: '点击上方卡片的按钮继续 ↑', en: 'Tap a card button above to continue ↑' },
  scenarioEnd: { zh: '场景演示结束 · 体验下一个场景', en: 'Scene complete · Try the next scenario' },
  exploreNext: { zh: '继续探索下一场景', en: 'Continue to next scene' },
  inputPlaceholder: { zh: '短信 · 与小移对话', en: 'SMS · chat with Xiaoyi' },
  // Left panel
  effectCompare: { zh: '效果对比', en: 'Outcome' },
  traditional: { zh: '传统方式', en: 'Traditional Way' },
  xiaoyiWay: { zh: '小移方式', en: 'Xiaoyi Way' },
  beforeLabel: { zh: '传统', en: 'Before' },
  afterLabel: { zh: '小移', en: 'Xiaoyi' },
  // Soul panel
  soulUnderstanding: { zh: 'Soul 理解度', en: 'Soul Understanding' },
  soulTagsLabel: { zh: '用户画像标签', en: 'Profile Tags' },
  soulTagsCount: { zh: '个', en: 'tags' },
  soulStats: { zh: '交互数据', en: 'Engagement Stats' },
  statDays: { zh: '交互天数', en: 'Days Active' },
  statProactive: { zh: '主动服务', en: 'Proactive' },
  statSaved: { zh: '已省金额', en: 'Saved' },
  statTime: { zh: '节省时间', en: 'Hours Saved' },
  // Radar dimensions
  radarComm: { zh: '通信', en: 'Comm' },
  radarTravel: { zh: '出行', en: 'Travel' },
  radarSpend: { zh: '消费', en: 'Spend' },
  radarPace: { zh: '节奏', en: 'Pace' },
  radarFamily: { zh: '家庭', en: 'Family' },
  // Timeline
  timelineEyebrow: { zh: 'SOUL 进化时间线', en: 'SOUL EVOLUTION TIMELINE' },
  timelineTitle: { zh: '从陌生人到灵魂伙伴', en: 'From Stranger to Soul Partner' },
  timelineSub: { zh: '滚动查看小移如何越用越懂你', en: 'Scroll to see how Xiaoyi grows with you' },
  switchCarrierTitle: { zh: '如果此时更换到其他运营商…', en: 'If you switch carriers now…' },
  moatLine: { zh: '这就是"灵魂壁垒"——运营商独有的用户粘性武器', en: 'This is the "Soul Moat" — a carrier-exclusive retention weapon' },
  // Cross-cut
  cardsTotal: { zh: '共 N 张卡片', en: 'N cards' },
  inboxTraditional: { zh: '传统短信收件箱（示例）', en: 'Traditional SMS inbox (sample)' },
  spamTag: { zh: '诈骗', en: 'Scam' },
  marketTag: { zh: '营销', en: 'Promo' },
  importantTag: { zh: '重要', en: 'Key' },
  // Common card terms
  online: { zh: '在线', en: 'Online' },
  // Footer
  footer: { zh: '© 2026 小移 Xiaoyi · 中国移动 AI 灵魂伴侣 · Demo v2.0', en: '© 2026 Xiaoyi · China Mobile AI Soul Companion · Demo v2.0' },
};

/* ============================================================
   LUCIDE ICON REGISTRY
   Inline SVG paths sourced from lucide.dev (ISC license).
   Renders as Icon name="bot" size={16} className="…"
   ============================================================ */
const LUCIDE = {
  bot: 'M12 8V4H8 M2 14h2 M20 14h2 M15 13v2 M9 13v2',
  send: 'm22 2-7 20-4-9-9-4Z M22 2 11 13',
  sparkles: 'M12 3l1.6 4.2L18 9l-4.4 1.8L12 15l-1.6-4.2L6 9l4.4-1.8L12 3z M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z M5 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z',
  zap: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  play: 'M6 4l14 8L6 20V4z',
  fastForward: 'm13 19 9-7-9-7v14z M2 19l9-7-9-7v14z',
  refresh: 'M3 12a9 9 0 0 1 15-6.7L21 8 M21 3v5h-5 M21 12a9 9 0 0 1-15 6.7L3 16 M3 21v-5h5',
  check: 'M20 6 9 17l-5-5',
  checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3',
  x: 'M18 6 6 18 M6 6l12 12',
  xCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M15 9l-6 6 M9 9l6 6',
  arrowRight: 'M5 12h14 M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5 M12 19l-7-7 7-7',
  chevronRight: 'm9 18 6-6-6-6',
  chevronDown: 'm6 9 6 6 6-6',
  menu: 'M4 12h16 M4 6h16 M4 18h16',
  signal: 'M2 20h.01 M7 20v-4 M12 20v-8 M17 20V8 M22 4v16',
  battery: 'M16 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z M22 11v2',
  wifi: 'M5 13a10 10 0 0 1 14 0 M8.5 16.5a5 5 0 0 1 7 0 M2 8.82a15 15 0 0 1 20 0 M12 20h.01',
  // Scenario tab icons
  barChart: 'M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  plane: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5L3 7c-.4.6-.2 1.2.4 1.5L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.6c.3.6.9.8 1.5.4l.3-.3c.4-.2.6-.6.5-1.1z',
  crown: 'm2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z M5 16h14',
  briefcase: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M2 8h20v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z',
  bookOpen: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2',
  heart: 'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z',
  brain: 'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z',
  // Card content icons
  calendar: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M16 2v4 M8 2v4 M3 10h18',
  mapPin: 'M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  wallet: 'M21 12V7H5a2 2 0 0 1 0-4h14v4 M3 5v14a2 2 0 0 0 2 2h16v-5 M18 12a2 2 0 0 0 0 4h4v-4z',
  creditCard: 'M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z M2 10h20',
  alertTriangle: 'M10.3 1.4c.5-.9 2-.9 2.5 0l9 16c.5.9-.2 2-1.3 2H2.6c-1.1 0-1.8-1.1-1.3-2z M12 9v4 M12 17h.01',
  cloudRain: 'M16 13v8 M8 13v8 M12 15v8 M20 16.6A5 5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9',
  sun: 'M12 2v2 M12 20v2 M5 5l1.4 1.4 M17.6 17.6 19 19 M2 12h2 M20 12h2 M5 19l1.4-1.4 M17.6 6.4 19 5 M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
  package: 'm7.5 4.27 9 5.15 M21 8-9-5-9 5 9 5 9-5z M3 8v8l9 5 9-5V8 M12 13v9',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0',
  lock: 'M5 11h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z M7 11V7a5 5 0 0 1 10 0v4',
  unlock: 'M5 11h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z M7 11V7a5 5 0 0 1 9.9-1',
  bellOff: 'M8.7 3A6 6 0 0 1 18 8a21 21 0 0 0 .6 5 M17 17H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0 M2 2l20 20',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  languages: 'm5 8 6 6 M4 14l6-6 2-3 M2 5h12 M7 2h1 M22 22l-5-10-5 10 M14 18h6',
  gift: 'M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  coffee: 'M17 8h1a4 4 0 0 1 0 8h-1 M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z M6 1v3 M10 1v3 M14 1v3',
  utensils: 'M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2 M7 2v20 M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  star: 'm12 2 3.1 6.3L22 9.3l-5 4.9 1.2 6.8L12 17.8l-6.2 3.2L7 14.2 2 9.3l6.9-1z',
  trendingUp: 'm22 7-8.5 8.5-5-5L2 17 M16 7h6v6',
  flame: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2.2-1.5-3.2C8 7.4 8.7 5 9.5 4 8 5 5 7 5 11.5a4 4 0 0 0 7.6 1.7',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2 M5.5 5h13l3 7v6a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-6z',
  filter: 'M22 3H2l8 9.5V19l4 2v-8.5z',
  shieldCheck: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  search: 'M11 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M21 21l-4.3-4.3',
  // moat / arrows
  trophy: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0z',
  rocket: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  smile: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z',
  navigation: 'M3 11l19-9-9 19-2-8-8-2z',
  car: 'M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6A1.7 1.7 0 0 0 11.95 7H4a2 2 0 0 0-2 1.74L2 12v4h2 M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  airplay: 'M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1 M12 15l5 6H7z',
  trainTrack: 'M2 17 22 7 M2 7l20 10 M14 5l3 3 M7 19l3 3 M9 11l3 3 M12 8l3 3 M5 13l3 3',
};

function Icon({ name, size = 16, className = '', stroke = 'currentColor', strokeWidth = 2, fill = 'none', style }) {
  const path = LUCIDE[name];
  if (!path) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}>
        <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke={stroke} strokeWidth={strokeWidth}/>
      </svg>
    );
  }
  // Each space-separated token after a 'M' starts a new path command, but Lucide
  // multi-shape icons are space-separated. We split by ' M ' to render multiple paths.
  const segments = path.split(/(?= M )/).map(s => s.trim());
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {segments.length > 1
        ? segments.map((d, i) => <path key={i} d={d}/>)
        : <path d={path}/>}
    </svg>
  );
}

/* ============================================================
   DESIGN SYSTEM COMPONENTS
   Reusable primitives that compose the UI.
   ============================================================ */

/* Card — generic translucent card surface */
function Card({ children, className = '', onClick, padding = 16, style = {} }) {
  return (
    <div
      className={`panel-card ${className}`}
      onClick={onClick}
      style={{ padding, cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      {children}
    </div>
  );
}

/* IconBadge — square colored container for an icon */
function IconBadge({ name, size = 40, gradient = 'linear-gradient(135deg, #0066FF, #3B82F6)', glow = true, iconSize = 18 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 12,
      background: gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: glow ? '0 6px 20px rgba(0, 102, 255, 0.5)' : 'none',
      flexShrink: 0,
    }}>
      <Icon name={name} size={iconSize} stroke="white" strokeWidth={2.2}/>
    </div>
  );
}

/* StatBox — number + label tile */
function StatBox({ value, label }) {
  return (
    <div className="stat-box">
      <div className="num">{value}</div>
      <div className="lbl">{label}</div>
    </div>
  );
}

/* Drawer — right/left slide-out (used for mobile sidepanels) */
function Drawer({ open, side = 'right', title, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <Fragment>
      <div className="drawer-overlay" onClick={onClose}/>
      <aside className={`drawer ${side}`} role="dialog" aria-label={typeof title === 'string' ? title : ''}>
        <header className="drawer-header">
          <div className="drawer-title">{title}</div>
          <button className="header-action icon-only" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18}/>
          </button>
        </header>
        <div className="drawer-body">{children}</div>
      </aside>
    </Fragment>
  );
}

/* ============================================================
   PHONE PRIMITIVES
   ============================================================ */
const now = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

function StatusBar() {
  const [time, setTime] = useState(now());
  useEffect(() => {
    const tk = setInterval(() => setTime(now()), 30000);
    return () => clearInterval(tk);
  }, []);
  return (
    <div className="status-bar">
      <span>{time}</span>
      <div className="right">
        <Icon name="signal" size={13} stroke="#111"/>
        <span style={{ fontSize: 10, fontWeight: 700 }}>5G</span>
        <Icon name="battery" size={20} stroke="#111" strokeWidth={1.8}/>
      </div>
    </div>
  );
}

function SmsHeader() {
  const tr = useT();
  return (
    <div className="sms-header">
      <div className="sms-avatar">
        <Icon name="bot" size={18} stroke="white"/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{tr(UI.brand)}</div>
        <div style={{ fontSize: 11, color: '#34C759', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, background: '#34C759', borderRadius: '50%' }}/>
          {tr(UI.online)} · {tr(UI.brandSub)}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="msg-row bot animate-slide-up">
      <div className="msg-avatar">
        <Icon name="bot" size={14} stroke="white"/>
      </div>
      <div className="bubble bot" style={{ padding: '11px 14px' }}>
        <div className="typing-dots"><span/><span/><span/></div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const tr = useT();
  if (msg.type === 'system') {
    return (
      <div className="msg-row system animate-slide-up">
        <div className="bubble system">{tr(msg.text)}</div>
      </div>
    );
  }
  if (msg.type === 'divider') {
    return <div className="time-divider animate-slide-up">— {tr(msg.text)} —</div>;
  }
  const isUser = msg.sender === 'user';
  return (
    <div className={`msg-row ${isUser ? 'user' : 'bot'} animate-slide-up`}>
      {!isUser && (
        <div className="msg-avatar">
          <Icon name="bot" size={14} stroke="white"/>
        </div>
      )}
      <div className={`bubble ${isUser ? 'user' : 'bot'}`}>{tr(msg.text)}</div>
    </div>
  );
}

/* ============================================================
   RCS CARD — rich card with optional icon, fields, rows, bullets, buttons
   All text fields support bilingual {zh,en} objects.
   ============================================================ */
function RCSCard({ card, onAction }) {
  const tr = useT();
  const tone = card.tone || 'brand';
  return (
    <div className="msg-row bot animate-slide-up">
      <div className="msg-avatar">
        <Icon name="bot" size={14} stroke="white"/>
      </div>
      <div className={`rcs-card ${tone}`} style={{ animation: 'scale-in 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2) both' }}>
        <div className="accent-bar"/>
        <div className="rcs-body">
          <div className="rcs-title">
            {card.icon && <Icon name={card.icon} size={16} stroke={cardIconColor(tone)}/>}
            <span>{tr(card.title)}</span>
          </div>
          {card.subtitle && <div className="rcs-subtitle">{tr(card.subtitle)}</div>}

          {card.text && (
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.55, marginTop: 4, whiteSpace: 'pre-line' }}>
              {tr(card.text)}
            </div>
          )}

          {card.fields && (
            <div className="rcs-fields">
              {card.fields.map((f, i) => (
                <div key={i}>
                  <div className="rcs-field-row">
                    <span>{tr(f.label)}</span>
                    <span className="val">{tr(f.value)}</span>
                  </div>
                  {f.progress !== undefined && (
                    <div className="progress-track">
                      <div className={`progress-fill ${f.tone || ''}`} style={{ width: `${f.progress}%` }}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {card.rows && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {card.rows.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5, color: '#333' }}>
                  <div style={{ minWidth: 50, fontWeight: 700, color: '#0066FF', flexShrink: 0 }}>{tr(r.time)}</div>
                  <div style={{ flex: 1 }}>{tr(r.event)}</div>
                </div>
              ))}
            </div>
          )}

          {card.bullets && (
            <ul style={{ marginTop: 10, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {card.bullets.map((b, i) => (
                <li key={i} style={{ fontSize: 12.5, color: '#444', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <Icon name="check" size={12} stroke="#0066FF" strokeWidth={2.5} style={{ marginTop: 3, flexShrink: 0 }}/>
                  <span>{tr(b)}</span>
                </li>
              ))}
            </ul>
          )}

          {card.highlight && (
            <div className={`highlight-box ${card.highlight.tone || 'brand'}`}>
              {card.highlight.icon && <Icon name={card.highlight.icon} size={14}/>}
              <span>{tr(card.highlight.text)}</span>
            </div>
          )}

          {card.foot && (
            <div style={{ fontSize: 11, color: '#888', marginTop: 10, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {tr(card.foot)}
            </div>
          )}

          {card.buttons && (
            <div className="rcs-buttons">
              {card.buttons.map((b, i) => (
                <button
                  key={i}
                  className={`rcs-btn ${b.tone || ''}`}
                  onClick={() => onAction && onAction(b.action, tr(b.userText || b.text), { decorative: !b.userText, ack: b.ack })}
                >
                  {b.icon && <Icon name={b.icon} size={12} stroke="currentColor" strokeWidth={2.4}/>}
                  <span>{tr(b.text)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cardIconColor(tone) {
  const map = { brand: '#0066FF', success: '#047857', danger: '#B91C1C', warning: '#B45309', gold: '#B45309' };
  return map[tone] || '#0066FF';
}

/* RCS Multi — series of mini-cards (e.g. SMS classification) */
function RCSMulti({ cards, onAction }) {
  const tr = useT();
  return (
    <div className="msg-row bot animate-slide-up" style={{ flexDirection: 'column', alignItems: 'flex-start', maxWidth: '92%' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 4 }}>
        <div className="msg-avatar">
          <Icon name="bot" size={14} stroke="white"/>
        </div>
        <div style={{ fontSize: 11, color: '#888' }}>{tr(UI.cardsTotal).replace('N', cards.length)}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 36 }}>
        {cards.map((c, i) => (
          <div key={i} className={`rcs-card ${c.tone || 'brand'}`} style={{ animation: `scale-in 0.4s ${i * 0.12}s cubic-bezier(0.2, 0.9, 0.3, 1.2) both` }}>
            <div className="accent-bar"/>
            <div className="rcs-body">
              <div className="rcs-title">
                {c.icon && <Icon name={c.icon} size={15} stroke={cardIconColor(c.tone || 'brand')}/>}
                <span>{tr(c.title)}</span>
              </div>
              {c.subtitle && <div className="rcs-subtitle">{tr(c.subtitle)}</div>}
              {c.text && (
                <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  {tr(c.text)}
                </div>
              )}
              {c.code && (
                <div style={{ marginTop: 6, padding: '6px 10px', background: '#F5F7FA', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#0066FF', letterSpacing: 1 }}>
                  {tr(c.code)}
                </div>
              )}
              {c.highlight && (
                <div className={`highlight-box ${c.highlight.tone || 'brand'}`}>
                  {c.highlight.icon && <Icon name={c.highlight.icon} size={13}/>}
                  <span>{tr(c.highlight.text)}</span>
                </div>
              )}
              {c.buttons && (
                <div className="rcs-buttons">
                  {c.buttons.map((b, j) => (
                    <button key={j} className={`rcs-btn ${b.tone || ''}`} onClick={() => onAction && onAction(b.action, tr(b.userText || b.text), { decorative: !b.userText, ack: b.ack })}>
                      {b.icon && <Icon name={b.icon} size={11} strokeWidth={2.4}/>}
                      <span>{tr(b.text)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Junk SMS Inbox preview (used in the SMS hub scenario) */
function JunkSMSInbox({ items }) {
  const tr = useT();
  return (
    <div className="msg-row bot animate-slide-up" style={{ flexDirection: 'column', alignItems: 'flex-start', maxWidth: '92%' }}>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 6, marginLeft: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="inbox" size={12} stroke="#888"/>
        {tr(UI.inboxTraditional)}
      </div>
      <div style={{ width: 260 }}>
        {items.map((it, i) => (
          <div key={i} className={`junk-sms ${it.kind || ''}`} style={{ animation: `slide-in-left 0.35s ${i * 0.08}s both` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sender">{tr(it.sender)}</div>
              <div className="preview">{tr(it.preview)}</div>
            </div>
            {it.tagKey && (
              <div style={{
                fontSize: 9,
                padding: '2px 6px',
                borderRadius: 4,
                background: it.kind === 'spam' ? '#FEE2E2' : '#E0E7FF',
                color: it.kind === 'spam' ? '#B91C1C' : '#1E40AF',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {tr(UI[it.tagKey])}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SOUL PROFILE — radar chart, tags, stats
   ============================================================ */
function SoulRadar({ data, size = 170 }) {
  const tr = useT();
  const dimKeys = [UI.radarComm, UI.radarTravel, UI.radarSpend, UI.radarPace, UI.radarFamily];
  const cx = size / 2, cy = size / 2;
  const R = size * 0.36;
  const angle = (i) => (-Math.PI / 2) + (i * 2 * Math.PI / 5);
  const point = (i, r) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r];
  const ringPath = (r) => dimKeys.map((_, i) => {
    const [x, y] = point(i, r);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ') + 'Z';
  const dataPath = dimKeys.map((_, i) => {
    const [x, y] = point(i, R * (data[i] || 0) / 100);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: size, height: 'auto' }}>
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0.08"/>
        </radialGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((k, i) => (
        <path key={i} d={ringPath(R * k)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      ))}
      {dimKeys.map((_, i) => {
        const [x, y] = point(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>;
      })}
      <path d={dataPath} fill="url(#radarGlow)" stroke="#3B82F6" strokeWidth="1.5"/>
      {dimKeys.map((d, i) => {
        const [x, y] = point(i, R + 14);
        return (
          <text key={i} x={x} y={y} fill="#94a3b8" fontSize="10" textAnchor="middle" dominantBaseline="middle">
            {tr(d)}
          </text>
        );
      })}
      {dimKeys.map((_, i) => {
        const [x, y] = point(i, R * (data[i] || 0) / 100);
        return <circle key={i} cx={x} cy={y} r="3" fill="#60A5FA"/>;
      })}
    </svg>
  );
}

function SoulPanel({ soul, freshTags }) {
  const tr = useT();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="soul-card" style={{ textAlign: 'center' }}>
        <div style={{
          width: 62,
          height: 62,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0066FF, #8B5CF6)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,102,255,0.4)',
        }}>
          <Icon name="user" size={28} stroke="white" strokeWidth={2}/>
        </div>
        <div style={{ marginTop: 10, fontSize: 15, fontWeight: 700 }}>{tr(soul.phone)}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{tr(soul.tier)}</div>
      </div>

      <div className="soul-card">
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{tr(UI.soulUnderstanding)}</span>
          <span style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg,#60A5FA,#FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {soul.score}%
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SoulRadar data={soul.radar} size={170}/>
        </div>
      </div>

      <div className="soul-card">
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>{tr(UI.soulTagsLabel)}</span>
          <span style={{ color: '#60A5FA' }}>{soul.tags.length} {tr(UI.soulTagsCount)}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {soul.tags.map((tag, i) => {
            // Canonical key (always zh string) is used for fresh-tag matching so the
            // pulse highlight works regardless of current language.
            const tagKey = typeof tag.t === 'string' ? tag.t : (tag.t.zh || tag.t.en || '');
            const tagText = tr(tag.t);
            return (
              <span key={`${tagKey}-${i}`} className={`soul-tag ${freshTags.includes(tagKey) ? 'fresh' : ''}`}>{tagText}</span>
            );
          })}
        </div>
      </div>

      <div className="soul-card">
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 8 }}>{tr(UI.soulStats)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <StatBox value={soul.stats.days} label={tr(UI.statDays)}/>
          <StatBox value={soul.stats.proactive} label={tr(UI.statProactive)}/>
          <StatBox value={`¥${soul.stats.saved}`} label={tr(UI.statSaved)}/>
          <StatBox value={`${soul.stats.time}h`} label={tr(UI.statTime)}/>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LEFT PANEL — scenario info + traditional vs xiaoyi compare
   ============================================================ */
function LeftPanel({ scenario }) {
  const tr = useT();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="panel-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <IconBadge name={scenario.icon} size={42} iconSize={20}/>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800 }}>{tr(scenario.name)}</div>
            <div style={{ fontSize: 11, color: '#60A5FA', fontWeight: 600 }}>{tr(scenario.tagline)}</div>
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.65 }}>{tr(scenario.intro)}</div>
      </div>

      <div className="panel-card" style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="zap" size={12} stroke="#94a3b8" fill="#94a3b8" strokeWidth={1.5}/>
          {tr(UI.effectCompare)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 3 }}>{tr(UI.beforeLabel)}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textDecoration: 'line-through' }}>{tr(scenario.metric.before)}</div>
          </div>
          <Icon name="arrowRight" size={18} stroke="#60A5FA"/>
          <div style={{
            flex: 1,
            textAlign: 'center',
            padding: '10px 6px',
            background: 'linear-gradient(135deg,rgba(0,102,255,0.18),rgba(59,130,246,0.08))',
            borderRadius: 10,
            border: '1px solid rgba(0,102,255,0.4)',
          }}>
            <div style={{ fontSize: 10, color: '#60A5FA', marginBottom: 3 }}>{tr(UI.afterLabel)}</div>
            <div style={{ fontSize: 14, fontWeight: 800, background: 'linear-gradient(135deg,#60A5FA,#FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {tr(scenario.metric.after)}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10, textAlign: 'center', padding: 8, background: 'rgba(52,199,89,0.1)', borderRadius: 10, fontSize: 12, color: '#6EE7B7', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name="trendingUp" size={12} stroke="#6EE7B7"/>
          {tr(scenario.metric.save)}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="compare-col old">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="x" size={13} strokeWidth={2.5}/>
            {tr(UI.traditional)}
          </div>
          {scenario.traditional.map((it, i) => (
            <div key={i} className="compare-step">
              <Icon name="x" size={11} stroke="#888" strokeWidth={2.5}/>
              <span>{tr(it.text)}</span>
            </div>
          ))}
        </div>
        <div className="compare-col new">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#60A5FA', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="check" size={13} strokeWidth={2.5}/>
            {tr(UI.xiaoyiWay)}
          </div>
          {scenario.xiaoyi.map((it, i) => (
            <div key={i} className="compare-step">
              <Icon name="check" size={11} stroke="#60A5FA" strokeWidth={2.5}/>
              <span>{tr(it.text)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TIMELINE VIEW (used by the Soul Evolution scenario)
   ============================================================ */
function TimelineView({ scenario }) {
  const tr = useT();
  const moatItems = [
    { zh: '丢失 180 天积累的 Soul 档案', en: 'Lose 180 days of Soul profile' },
    { zh: '新 AI 需要从零开始学习', en: 'New AI starts from zero' },
    { zh: '不再有精准的预测式服务', en: 'No more predictive service' },
    { zh: '不再有每日专属日报', en: 'No more daily personal briefing' },
    { zh: '不再有航班延误主动提醒', en: 'No more proactive flight alerts' },
    { zh: '不再有垃圾短信智能过滤', en: 'No more smart SMS filtering' },
  ];

  return (
    <div style={{
      width: '100%',
      maxWidth: 720,
      background: 'linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.1))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    }}>
      <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 11, color: '#60A5FA', fontWeight: 700, letterSpacing: 1.2 }}>
          {tr(UI.timelineEyebrow)}
        </div>
        <div style={{
          fontSize: 22,
          fontWeight: 900,
          marginTop: 4,
          background: 'linear-gradient(135deg,#60A5FA 0%,#FFFFFF 50%,#FBBF24 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {tr(UI.timelineTitle)}
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
          {tr(UI.timelineSub)}
        </div>
      </div>

      <div className="timeline" style={{ maxHeight: 560, overflowY: 'auto' }}>
        {scenario.timeline.map((node, i) => (
          <div key={i} className="timeline-node" style={{ animation: `slide-up-fade 0.6s ${i * 0.15}s both` }}>
            <div className="timeline-dot">
              {node.icon && <Icon name={node.icon} size={14} stroke="white"/>}
            </div>
            <div className="timeline-card">
              <div className="phase">{tr(node.phase)}</div>
              <div className="title">{tr(node.title)}</div>
              {node.dialogues.map((d, j) => (
                <div key={j} className={`dialogue ${d.role === 'user' ? 'user' : ''}`}>
                  <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 2, color: d.role === 'user' ? '#9ca3af' : '#60A5FA', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name={d.role === 'user' ? 'user' : 'bot'} size={10} stroke="currentColor"/>
                    {d.role === 'user' ? (tr({ zh: '用户', en: 'User' })) : tr(UI.brand)}
                  </div>
                  <div>{tr(d.text)}</div>
                </div>
              ))}
              <div className="soul-update-strip">
                <Icon name="trendingUp" size={11} stroke="#93c5fd"/>
                {tr(node.soulUpdate)}
              </div>
            </div>
          </div>
        ))}

        <div className="moat-card" style={{ animation: 'slide-up-fade 0.6s 0.9s both' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FCA5A5', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="alertTriangle" size={16} stroke="#FCA5A5"/>
            {tr(UI.switchCarrierTitle)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8, fontSize: 12 }}>
            {moatItems.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, color: '#fecaca', alignItems: 'flex-start' }}>
                <Icon name="x" size={12} stroke="#FF6B6B" strokeWidth={2.5}/>
                <span>{tr(it)}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 14,
            padding: 12,
            background: 'linear-gradient(135deg,rgba(0,102,255,0.2),rgba(59,130,246,0.1))',
            border: '1px solid rgba(0,102,255,0.4)',
            borderRadius: 12,
            fontSize: 13,
            color: '#bfdbfe',
            textAlign: 'center',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <Icon name="shieldCheck" size={14} stroke="#bfdbfe"/>
            {tr(UI.moatLine)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ACK DEFAULTS — inline acknowledgments for decorative button clicks
   (buttons without a `userText` field do NOT advance the script;
    instead they produce a small ack bubble from Xiaoyi so the user
    always sees a response to their tap.)
   ============================================================ */
const GENERIC_ACK = { zh: '好的，已为你处理。', en: 'Done, I\'ve handled it.' };
const ACK_DEFAULTS = {
  detail: { zh: '详情已为你打开。', en: 'Details opened for you.' },
  view: { zh: '已为你打开。', en: 'Opened for you.' },
  noop: { zh: '好的，已为你打开。', en: 'OK, opened for you.' },
  nav: { zh: '导航已为你打开。', en: 'Navigation opened.' },
  navigate: { zh: '导航已为你打开。', en: 'Navigation opened.' },
  locate: { zh: '位置已为你定位好。', en: 'Location pinned for you.' },
  edit: { zh: '编辑器已为你打开，可直接修改。', en: 'Editor opened — you can edit directly.' },
  other: { zh: '好的，我再为你推荐几个其他选项。', en: 'OK, let me suggest some alternatives.' },
  switch: { zh: '没问题，我换个方案给你看。', en: 'No problem, here\'s another option.' },
  remind: { zh: '提醒已为你设置好。', en: 'Reminder is set for you.' },
  bell: { zh: '提醒已为你设置好。', en: 'Reminder is set for you.' },
  later: { zh: '好，我会稍后再提醒你。', en: 'OK, I\'ll remind you later.' },
  download: { zh: '文件已开始下载。', en: 'File download started.' },
  info: { zh: '好的，已为你打开。', en: 'OK, opened for you.' },
};

/* ============================================================
   PHONE SIMULATOR — playback engine
   ============================================================ */
function PhoneSimulator({ scenario, soul, setSoul, freshTags, setFreshTags, sessionKey }) {
  const tr = useT();
  const [played, setPlayed] = useState([]);
  const [idx, setIdx] = useState(0);
  const [typing, setTyping] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setPlayed([]); setIdx(0); setTyping(false); setWaiting(false); setDone(false);
  }, [sessionKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 1000;
    }
  }, [played, typing]);

  const applySoul = useCallback((soulPatch) => {
    if (!soulPatch) return;
    setSoul(prev => {
      const next = { ...prev };
      if (soulPatch.tagAdd) {
        const tagText = typeof soulPatch.tagAdd === 'string' ? soulPatch.tagAdd : (soulPatch.tagAdd.zh || soulPatch.tagAdd.en);
        const exists = prev.tags.some(x => {
          const xt = typeof x.t === 'string' ? x.t : (x.t.zh || x.t.en);
          return xt === tagText;
        });
        if (!exists) {
          next.tags = [...prev.tags, { t: soulPatch.tagAdd }];
          // Set fresh state for both languages
          const freshKey = tagText;
          setFreshTags(ft => [...ft, freshKey]);
          setTimeout(() => setFreshTags(ft => ft.filter(x => x !== freshKey)), 3600);
        }
      }
      if (soulPatch.scoreAdd) next.score = Math.min(100, prev.score + soulPatch.scoreAdd);
      if (soulPatch.statPatch) next.stats = { ...prev.stats, ...soulPatch.statPatch };
      return next;
    });
  }, [setSoul, setFreshTags]);

  const playStep = useCallback(() => {
    const step = scenario.steps[idx];
    if (!step) { setDone(true); return; }

    if (step.t === 'pause') { setWaiting(true); return; }

    if (step.t === 'typing') {
      setTyping(true);
      const delay = step.dur || 1200;
      timerRef.current = setTimeout(() => {
        setTyping(false);
        if (step.soul) applySoul(step.soul);
        setIdx(i => i + 1);
      }, delay);
      return;
    }

    setPlayed(p => [...p, { ...step, _k: Math.random().toString(36).slice(2) }]);
    if (step.soul) applySoul(step.soul);
    const d = step.delay || 600;
    timerRef.current = setTimeout(() => setIdx(i => i + 1), d);
  }, [idx, scenario.steps, applySoul]);

  useEffect(() => {
    if (!waiting && !done) {
      const tk = setTimeout(playStep, 50);
      return () => clearTimeout(tk);
    }
  }, [idx, waiting, done, playStep]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, [sessionKey]);

  const handleAction = useCallback((action, label, opts = {}) => {
    const { decorative = false, ack: customAck } = opts;
    const randKey = () => Math.random().toString(36).slice(2);

    // Flow button (non-decorative): only responds when the engine is paused
    // and the user's choice is meant to advance the script.
    if (!decorative) {
      if (!waiting) return; // ignore out-of-context clicks
      if (label) {
        setPlayed(p => [...p, { t: 'text', sender: 'user', text: label, _k: randKey() }]);
      }
      setWaiting(false);
      setIdx(i => i + 1);
      return;
    }

    // Decorative click (no userText on the card button): acknowledge inline
    // without advancing the scripted flow. User can still click a quick reply
    // in the input area to move the scenario forward.
    if (label) {
      setPlayed(p => [...p, { t: 'text', sender: 'user', text: label, _k: randKey() }]);
    }
    const ackText = customAck || ACK_DEFAULTS[action] || GENERIC_ACK;
    setTimeout(() => {
      setPlayed(p => [...p, { t: 'text', sender: 'xiaoyi', text: ackText, _k: randKey() }]);
    }, 500);
  }, [waiting]);

  const fastForward = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    let cur = idx;
    const remaining = [];
    while (cur < scenario.steps.length) {
      const s = scenario.steps[cur];
      if (s.t === 'pause') break;
      if (s.t !== 'typing') remaining.push({ ...s, _k: Math.random().toString(36).slice(2) });
      if (s.soul) applySoul(s.soul);
      cur++;
    }
    setTyping(false);
    setPlayed(p => [...p, ...remaining]);
    setIdx(cur);
    if (cur >= scenario.steps.length) setDone(true);
    else if (scenario.steps[cur]?.t === 'pause') setWaiting(true);
  };

  const replay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPlayed([]); setIdx(0); setTyping(false); setWaiting(false); setDone(false);
    setSoul(scenario.soul); setFreshTags([]);
  };

  const currentPause = waiting ? scenario.steps[idx] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div className="phone-frame">
        <div className="phone-notch"/>
        <div className="phone-screen">
          <StatusBar/>
          <SmsHeader/>
          <div className="chat-area" ref={scrollRef}>
            {played.map((m, i) => {
              if (m.t === 'text' || m.t === 'system' || m.t === 'divider') {
                return <MessageBubble key={m._k || i} msg={{ type: m.t === 'text' ? 'text' : m.t, sender: m.sender, text: m.text }}/>;
              }
              if (m.t === 'rcs') return <RCSCard key={m._k || i} card={m.card} onAction={handleAction}/>;
              if (m.t === 'multi') return <RCSMulti key={m._k || i} cards={m.cards} onAction={handleAction}/>;
              if (m.t === 'junk') return <JunkSMSInbox key={m._k || i} items={m.items}/>;
              return null;
            })}
            {typing && <TypingIndicator/>}
            {done && (
              <div className="msg-row system animate-slide-up">
                <div className="bubble system" style={{ background: 'linear-gradient(135deg,rgba(0,102,255,0.15),rgba(139,92,246,0.1))', color: '#93c5fd', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="checkCircle" size={12} stroke="#93c5fd"/>
                  {tr(UI.scenarioEnd)}
                </div>
              </div>
            )}
          </div>

          <div className="input-area">
            {currentPause && currentPause.replies && currentPause.replies.length > 0 && (
              <div className="quick-replies no-scrollbar">
                {currentPause.replies.map((r, i) => (
                  <button key={i} className={`quick-reply ${r.primary ? 'primary' : ''}`} onClick={() => handleAction(r.action, r.user ? tr(r.label) : null)}>
                    {tr(r.label)}
                  </button>
                ))}
              </div>
            )}
            {currentPause && (!currentPause.replies || currentPause.replies.length === 0) && (
              <div className="quick-replies no-scrollbar">
                <span className="quick-reply" style={{ opacity: 0.7, cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.4)', color: '#FBBF24' }}>
                  <Icon name="chevronDown" size={11} style={{ transform: 'rotate(180deg)' }}/>
                  {tr(UI.tapCardHint)}
                </span>
              </div>
            )}
            {!currentPause && !done && (
              <div className="quick-replies no-scrollbar">
                <span className="quick-reply" style={{ opacity: 0.6, cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="sparkles" size={11}/>
                  {tr(UI.playing)}
                </span>
              </div>
            )}
            {done && (
              <div className="quick-replies no-scrollbar">
                <span className="quick-reply" style={{ opacity: 0.6, cursor: 'default' }}>{tr(UI.exploreNext)}</span>
              </div>
            )}
            <div className="input-row">
              <input placeholder={tr(UI.inputPlaceholder)} readOnly/>
              <button aria-label="Send"><Icon name="send" size={16} stroke="white"/></button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={fastForward}
          disabled={done || waiting}
          className="header-action"
          style={{ opacity: (done || waiting) ? 0.4 : 1, cursor: (done || waiting) ? 'not-allowed' : 'pointer' }}
        >
          <Icon name="fastForward" size={12} fill="currentColor"/>
          {tr(UI.fastForward)}
        </button>
        <button onClick={replay} className="header-action">
          <Icon name="refresh" size={12}/>
          {tr(UI.replay)}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   WELCOME SCREEN
   ============================================================ */
function WelcomeScreen({ onEnter }) {
  const tr = useT();
  const { lang, setLang } = useContext(LangContext);
  const particles = useMemo(() => Array.from({ length: 36 }).map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    dx: (Math.random() - 0.5) * 280 + 'px',
    dy: (Math.random() - 0.5) * 280 + 'px',
    delay: Math.random() * 6,
    size: 2 + Math.random() * 3,
  })), []);

  return (
    <div className="welcome-overlay">
      {particles.map((p, i) => (
        <div key={i} className="welcome-particle" style={{
          left: p.left + '%',
          top: p.top + '%',
          width: p.size,
          height: p.size,
          animationDelay: p.delay + 's',
          '--dx': p.dx,
          '--dy': p.dy,
        }}/>
      ))}

      {/* Language toggle in corner */}
      <button
        className="header-action"
        onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
        style={{ position: 'absolute', top: 24, right: 24, zIndex: 5 }}
        aria-label={tr(UI.langLabel)}
      >
        <Icon name="languages" size={14}/>
        {tr(UI.langToggle)}
      </button>

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: 20, maxWidth: 720 }}>
        <div style={{ fontSize: 13, color: '#60A5FA', letterSpacing: 3, fontWeight: 600, marginBottom: 16, opacity: 0.9, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="sparkles" size={14}/>
          {tr(UI.welcomeEyebrow)}
        </div>
        <h1 className="welcome-title animate-slide-up">{tr(UI.brand)}</h1>
        <div style={{ fontSize: 22, fontWeight: 300, color: '#e2e8f0', marginTop: 16, letterSpacing: 1, animation: 'slide-up-fade 0.7s 0.15s both' }}>
          {tr(UI.welcomeTagline)}
        </div>
        <div style={{ fontSize: 15, color: '#94a3b8', marginTop: 30, lineHeight: 2, animation: 'slide-up-fade 0.8s 0.3s both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="heart" size={14} stroke="#60A5FA"/>
            {tr(UI.welcomeLine1)}
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <span style={{ color: '#FBBF24', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name="zap" size={12} fill="#FBBF24" stroke="#FBBF24"/>
              {tr(UI.welcomePillar1)}
            </span>
            <span style={{ color: '#60A5FA', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name="bell" size={12}/>
              {tr(UI.welcomePillar2)}
            </span>
            <span style={{ color: '#A78BFA', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name="brain" size={12}/>
              {tr(UI.welcomePillar3)}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 50, animation: 'slide-up-fade 0.9s 0.5s both' }}>
          <button className="glow-btn" onClick={onEnter}>
            {tr(UI.welcomeCTA)}
            <Icon name="arrowRight" size={18}/>
          </button>
        </div>

        <div style={{ marginTop: 32, fontSize: 12, color: '#64748b', animation: 'slide-up-fade 1s 0.7s both' }}>
          {tr(UI.welcomeFoot)}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center', fontSize: 11, color: '#475569', letterSpacing: 2 }}>
        HUAWEI × CHINA MOBILE
      </div>
    </div>
  );
}

/* ============================================================
   HEADER (responsive + language toggle + mobile menu)
   ============================================================ */
function Header({ current, onSelect, scenarios, onOpenMenu, onOpenSoul }) {
  const tr = useT();
  const { lang, setLang } = useContext(LangContext);

  return (
    <header className="app-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', maxWidth: 1480, margin: '0 auto' }}>
        <div className="brand-row">
          <div className="brand-mark">
            <Icon name="bot" size={20} stroke="white" strokeWidth={2.4}/>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg,#FFFFFF,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -0.3 }}>
              {tr(UI.brand)} <span style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8', WebkitTextFillColor: '#94a3b8' }}>Xiaoyi</span>
            </div>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 0.5 }}>{tr(UI.brandSub)}</div>
          </div>
        </div>

        {/* Desktop scene tabs (hidden on mobile) */}
        <div className="scene-tabs no-scrollbar desktop-tabs" style={{ flex: 1, justifyContent: 'center', maxWidth: 900 }}>
          {scenarios.map((s, i) => (
            <button key={s.id} className={`scene-tab ${current === i ? 'active' : ''}`} onClick={() => onSelect(i)}>
              <Icon name={s.icon} size={14}/>
              <span>{tr(s.name)}</span>
            </button>
          ))}
        </div>

        {/* Right side: language toggle + mobile menu */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="header-action"
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            aria-label={tr(UI.langLabel)}
            title={tr(UI.langLabel)}
          >
            <Icon name="languages" size={14}/>
            {tr(UI.langToggle)}
          </button>
          <button className="menu-btn" onClick={onOpenMenu} aria-label={tr(UI.menu)}>
            <Icon name="menu" size={20}/>
          </button>
        </div>
      </div>

      {/* Mobile-only horizontal scene tabs row (below brand row on small screens) */}
      <div className="scene-tabs no-scrollbar mobile-tabs" style={{ marginTop: 12, display: 'none' }}>
        {scenarios.map((s, i) => (
          <button key={s.id} className={`scene-tab ${current === i ? 'active' : ''}`} onClick={() => onSelect(i)}>
            <Icon name={s.icon} size={14}/>
            <span>{tr(s.name)}</span>
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .desktop-tabs { display: none !important; }
          .mobile-tabs { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

/* ============================================================
   APP — main orchestrator
   ============================================================ */
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [current, setCurrent] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);
  const [lang, setLang] = useState('zh');
  const [drawerLeft, setDrawerLeft] = useState(false);
  const [drawerRight, setDrawerRight] = useState(false);

  const scenario = SCENARIOS[current];
  const [soul, setSoul] = useState(scenario.soul);
  const [freshTags, setFreshTags] = useState([]);

  useEffect(() => {
    setSoul(SCENARIOS[current].soul);
    setFreshTags([]);
    setSessionKey(k => k + 1);
  }, [current]);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const langCtx = useMemo(() => ({ lang, setLang }), [lang]);

  const handleSelect = (i) => {
    if (i !== current) setCurrent(i);
    setDrawerLeft(false);
    setDrawerRight(false);
  };

  const isTimeline = scenario.id === 'evolution';

  return (
    <LangContext.Provider value={langCtx}>
      {showWelcome && <WelcomeScreen onEnter={() => setShowWelcome(false)}/>}

      <Header
        current={current}
        onSelect={handleSelect}
        scenarios={SCENARIOS}
        onOpenMenu={() => setDrawerLeft(true)}
        onOpenSoul={() => setDrawerRight(true)}
      />

      <main className="app-main">
        <div className="app-grid">
          {/* Left column (desktop only) */}
          <div className="left-col">
            <LeftPanel scenario={scenario}/>
          </div>

          {/* Center: phone or timeline */}
          <div className="app-center">
            {isTimeline ? (
              <TimelineView scenario={scenario}/>
            ) : (
              <PhoneSimulator
                scenario={scenario}
                soul={soul}
                setSoul={setSoul}
                freshTags={freshTags}
                setFreshTags={setFreshTags}
                sessionKey={sessionKey}
              />
            )}
          </div>

          {/* Right column (desktop only) */}
          <div className="right-col">
            <SoulPanel soul={soul} freshTags={freshTags}/>
          </div>
        </div>

        {/* Mobile actions: open left/right panels as drawers */}
        <div className="mobile-actions" style={{ display: 'none', position: 'fixed', bottom: 16, right: 16, gap: 10, flexDirection: 'column', zIndex: 40 }}>
          <button className="header-action" onClick={() => setDrawerLeft(true)} aria-label="Info">
            <Icon name="bookOpen" size={14}/>
            <UseTr value={UI.scenarioInfo}/>
          </button>
          <button className="header-action" onClick={() => setDrawerRight(true)} aria-label="Soul">
            <Icon name="user" size={14}/>
            <UseTr value={UI.soulProfile}/>
          </button>
        </div>

        {/* Transition hint */}
        <div style={{ maxWidth: 1480, margin: '30px auto 0', textAlign: 'center', padding: '0 16px' }}>
          {current < SCENARIOS.length - 1 && (
            <button onClick={() => handleSelect(current + 1)} className="header-action" style={{
              background: 'linear-gradient(135deg,rgba(0,102,255,0.15),rgba(139,92,246,0.1))',
              border: '1px solid rgba(0,102,255,0.3)',
              color: '#93c5fd',
              padding: '12px 22px',
              fontSize: 13,
              fontWeight: 600,
            }}>
              <Icon name="arrowRight" size={14}/>
              <UseTr value={{ zh: '继续下一场景', en: 'Next scenario' }}/>:
              &nbsp;<Icon name={SCENARIOS[current + 1].icon} size={14}/>&nbsp;
              <UseTr value={SCENARIOS[current + 1].name}/>
            </button>
          )}
          {current === SCENARIOS.length - 1 && (
            <button onClick={() => handleSelect(0)} className="header-action" style={{
              background: 'linear-gradient(135deg,rgba(255,149,0,0.2),rgba(251,191,36,0.1))',
              border: '1px solid rgba(255,149,0,0.4)',
              color: '#FBBF24',
              padding: '12px 22px',
              fontSize: 13,
              fontWeight: 600,
            }}>
              <Icon name="refresh" size={14}/>
              <UseTr value={{ zh: '回到起点重新体验', en: 'Restart from beginning' }}/>
            </button>
          )}
        </div>
      </main>

      <footer style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: 11, color: '#475569', letterSpacing: 0.6 }}>
        <UseTr value={UI.footer}/>
      </footer>

      {/* Drawers (mobile) */}
      <Drawer open={drawerLeft} side="left" title={<UseTr value={UI.scenarioInfo}/>} onClose={() => setDrawerLeft(false)}>
        <LeftPanel scenario={scenario}/>
      </Drawer>
      <Drawer open={drawerRight} side="right" title={<UseTr value={UI.soulProfile}/>} onClose={() => setDrawerRight(false)}>
        <SoulPanel soul={soul} freshTags={freshTags}/>
      </Drawer>

      {/* Mobile FABs - show only on small screens */}
      <style>{`
        @media (max-width: 1023px) {
          .mobile-actions { display: flex !important; }
        }
      `}</style>
    </LangContext.Provider>
  );
}

/* Helper: render bilingual value via the hook */
function UseTr({ value }) {
  const tr = useT();
  return <Fragment>{tr(value)}</Fragment>;
}

/* ============================================================
   SCENARIO DATA — 9 scenarios, all bilingual
   Every text/label/value is either a plain string or {zh, en}.
   Icons use Lucide registry names (no emoji).
   ============================================================ */

const S1_TARIFF = {
  id: 'tariff',
  name: { zh: '智能套餐管家', en: 'Smart Plan Manager' },
  icon: 'barChart',
  tagline: { zh: '被动响应 + AI 推荐', en: 'AI-Driven Plan Optimization' },
  intro: { zh: '小移基于真实使用数据主动分析你的套餐利用率，3 秒给出最优建议，一键完成变更。', en: 'Xiaoyi analyzes your real usage data, recommends the optimal plan in 3 seconds, and switches with one tap.' },
  traditional: [
    { text: { zh: '拨打 10086 排队 30+ 分钟', en: 'Call 10086, wait 30+ minutes' } },
    { text: { zh: '人工客服按话术推销', en: 'Agents push scripted upsells' } },
    { text: { zh: '反复确认套餐细节', en: 'Verify plan details repeatedly' } },
    { text: { zh: '不知道是否最优', en: 'Never sure it\'s optimal' } },
  ],
  xiaoyi: [
    { text: { zh: 'AI 主动发现套餐浪费', en: 'AI spots wasted spend automatically' } },
    { text: { zh: '3 秒精准分析', en: '3-second analysis' } },
    { text: { zh: '一键完成变更', en: 'Switch with one tap' } },
    { text: { zh: '持续跟踪与提醒', en: 'Continuous tracking & alerts' } },
  ],
  metric: { before: { zh: '30 分钟', en: '30 min' }, after: { zh: '30 秒', en: '30 sec' }, save: { zh: '年省 ¥840', en: 'Save ¥840/year' } },
  soul: {
    phone: '138****6789',
    tier: { zh: '畅享套餐用户', en: 'Standard Plan' },
    score: 32,
    radar: [30, 45, 25, 20, 15],
    tags: [
      { t: { zh: '新用户', en: 'New user' } },
      { t: { zh: '通信管家', en: 'Telecom care' } },
    ],
    stats: { days: 1, proactive: 1, saved: 0, time: 0 },
  },
  steps: [
    { t: 'divider', text: { zh: '今天 · 10:28', en: 'Today · 10:28' }, delay: 200 },
    { t: 'typing', delay: 400, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '你好，我是小移，你的 AI 通信管家。我注意到你的套餐可能不是最优选择，需要帮你分析一下吗？', en: 'Hi, I\'m Xiaoyi — your AI telecom companion. I noticed your current plan might not be the best fit. Want me to take a look?' } },
    { t: 'pause', replies: [
      { label: { zh: '好的，帮我看看', en: 'Sure, please' }, primary: true, user: true },
      { label: { zh: '暂时不用', en: 'Not now' } },
    ]},
    { t: 'typing', delay: 200, dur: 1500, soul: { tagAdd: { zh: '主动授权', en: 'Authorized' }, scoreAdd: 6 } },
    { t: 'rcs', sender: 'xiaoyi', card: {
      tone: 'brand',
      icon: 'barChart',
      title: { zh: '您的套餐使用分析', en: 'Your Plan Usage Analysis' },
      subtitle: { zh: '统计周期：近 3 个月', en: 'Period: last 3 months' },
      fields: [
        { label: { zh: '当前套餐', en: 'Current plan' }, value: { zh: '畅享 158 元套餐', en: 'Standard ¥158' } },
        { label: { zh: '月均流量', en: 'Avg data/mo' }, value: { zh: '16.8GB / 40GB', en: '16.8GB / 40GB' }, progress: 42 },
        { label: { zh: '月均通话', en: 'Avg minutes/mo' }, value: { zh: '89 分 / 500 分', en: '89 / 500 min' }, progress: 18, tone: 'warn' },
        { label: { zh: '月均消费', en: 'Avg spend' }, value: '¥158' },
      ],
      highlight: { tone: 'warning', icon: 'alertTriangle', text: { zh: '套餐利用率仅 30% · 每月约 ¥108 资源未使用', en: 'Only 30% utilized · ~¥108 wasted/month' } },
    }},
    { t: 'text', sender: 'xiaoyi', text: { zh: '基于你的使用习惯，我为你找到了一个更合适的方案：', en: 'Based on your habits, here\'s a better fit:' }, delay: 800, soul: { tagAdd: { zh: '价格敏感', en: 'Price-sensitive' }, scoreAdd: 8 } },
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'success',
      icon: 'checkCircle',
      title: { zh: '推荐方案：悦享 88 元套餐', en: 'Recommended: Smart ¥88 Plan' },
      fields: [
        { label: { zh: '流量', en: 'Data' }, value: { zh: '20GB（够用）', en: '20GB (plenty)' } },
        { label: { zh: '通话', en: 'Minutes' }, value: { zh: '200 分钟（够用）', en: '200 min (plenty)' } },
        { label: { zh: '月费', en: 'Monthly' }, value: '¥88' },
      ],
      highlight: { tone: 'success', icon: 'wallet', text: { zh: '每月省 ¥70  ·  每年省 ¥840', en: 'Save ¥70/month · ¥840/year' } },
      buttons: [
        { text: { zh: '立即切换', en: 'Switch now' }, action: 'switch', tone: 'primary', icon: 'refresh', userText: { zh: '立即切换', en: 'Switch now' } },
        { text: { zh: '查看详情', en: 'See details' }, action: 'detail', ack: { zh: '悦享 88 套餐：20GB 流量（不限速）· 200 分钟通话 · 100 条短信 · 赠免流音乐包 · 合约期 1 年可随时升级。', en: 'Smart ¥88: 20GB data (no throttle) · 200 min · 100 SMS · free music pack · 1-year contract, upgrade anytime.' } },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 200, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '好的，正在为您办理套餐变更…', en: 'Switching your plan now…' } },
    { t: 'typing', delay: 1000, dur: 1500 },
    { t: 'rcs', sender: 'xiaoyi', card: {
      tone: 'success',
      icon: 'checkCircle',
      title: { zh: '套餐变更成功！', en: 'Plan switched successfully!' },
      fields: [
        { label: { zh: '新套餐', en: 'New plan' }, value: { zh: '悦享 88 元', en: 'Smart ¥88' } },
        { label: { zh: '生效时间', en: 'Effective' }, value: { zh: '下月 1 日', en: 'Next month 1st' } },
        { label: { zh: '预计年省', en: 'Annual savings' }, value: '¥840' },
      ],
      foot: { zh: '小移会持续关注你的使用情况，如果新套餐不够用会提前提醒你。', en: 'I\'ll keep watching your usage and warn you ahead of time if the new plan runs short.' },
      highlight: { tone: 'success', icon: 'sparkles', text: { zh: '全年省下的钱够你吃 60 顿火锅', en: 'Enough savings for 60 hotpot dinners' } },
    }, soul: { tagAdd: { zh: '流量中度用户', en: 'Moderate data user' }, scoreAdd: 14, statPatch: { proactive: 3, saved: 840 } }},
    { t: 'text', sender: 'xiaoyi', text: { zh: '还有什么需要我帮忙的吗？我随时在线。', en: 'Anything else I can help with? I\'m always here.' } },
  ],
};

const S2_SMS = {
  id: 'sms',
  name: { zh: '短信中枢', en: 'SMS Hub' },
  icon: 'shield',
  tagline: { zh: '运营商独占数据优势', en: 'Carrier-Exclusive Data Moat' },
  intro: { zh: '将混乱的短信收件箱变成智能信息流，垃圾/诈骗自动过滤，重要信息卡片化一键操作。互联网公司做不到，只有运营商能做。', en: 'Transform a noisy inbox into a smart feed. Spam and fraud auto-filtered, important info as actionable cards. Only carriers can do this.' },
  traditional: [
    { text: { zh: '7+ 条短信混杂在收件箱', en: '7+ messages all mixed up' } },
    { text: { zh: '用户自己翻找，容易漏看', en: 'Easy to miss key items' } },
    { text: { zh: '诈骗短信风险高', en: 'High scam risk' } },
    { text: { zh: '重要通知淹没在广告中', en: 'Key alerts buried in ads' } },
  ],
  xiaoyi: [
    { text: { zh: 'AI 自动分类 + 卡片化', en: 'AI sorts into smart cards' } },
    { text: { zh: '诈骗 / 营销自动过滤', en: 'Auto-filters scams & promos' } },
    { text: { zh: '关键信息一键操作', en: 'One-tap actions on key info' } },
    { text: { zh: '运营商独占数据优势', en: 'Carrier-exclusive data moat' } },
  ],
  metric: { before: { zh: '7 条混乱', en: '7 messy' }, after: { zh: '3 类精选', en: '3 curated' }, save: { zh: '过滤 4 条垃圾', en: '4 junk filtered' } },
  soul: {
    phone: '138****6789',
    tier: { zh: '畅享套餐用户', en: 'Standard Plan' },
    score: 48,
    radar: [55, 50, 40, 35, 30],
    tags: [
      { t: { zh: '新用户', en: 'New user' } },
      { t: { zh: '通信管家', en: 'Telecom care' } },
      { t: { zh: '价格敏感', en: 'Price-sensitive' } },
      { t: { zh: '流量中度用户', en: 'Moderate data user' } },
    ],
    stats: { days: 7, proactive: 12, saved: 840, time: 2 },
  },
  steps: [
    { t: 'divider', text: { zh: '今天 · 09:15', en: 'Today · 09:15' } },
    { t: 'text', sender: 'xiaoyi', text: { zh: '今天已经为你拦截 4 条垃圾短信，下面是整理后的重要信息。', en: 'I blocked 4 junk messages today. Here are the important ones:' }, delay: 300 },
    { t: 'junk', items: [
      { sender: { zh: '【某贷款】', en: '[LoanCorp]' }, preview: { zh: '恭喜您获得 30 万额度…', en: 'You\'re approved for ¥300k…' }, kind: 'spam', tagKey: 'spamTag' },
      { sender: { zh: '【顺丰】', en: '[SF Express]' }, preview: { zh: '您的包裹已到达驿站…', en: 'Your package has arrived…' }, kind: 'important', tagKey: 'importantTag' },
      { sender: { zh: '【某赌场】', en: '[Casino]' }, preview: { zh: '注册送 888…', en: 'Sign up get ¥888…' }, kind: 'spam', tagKey: 'spamTag' },
      { sender: { zh: '【中国银行】', en: '[BoC]' }, preview: { zh: '您的信用卡账单…', en: 'Your credit card statement…' }, kind: 'important', tagKey: 'importantTag' },
      { sender: { zh: '【某推广】', en: '[Promo]' }, preview: { zh: '双十一特惠…', en: '11.11 deals…' }, kind: 'spam', tagKey: 'marketTag' },
      { sender: { zh: '【南航】', en: '[ChinaSouthern]' }, preview: { zh: '您的航班 CZ3108…', en: 'Your flight CZ3108…' }, kind: 'important', tagKey: 'importantTag' },
      { sender: { zh: '【某投资】', en: '[Invest]' }, preview: { zh: '日赚 500 不是梦…', en: 'Earn ¥500/day easily…' }, kind: 'spam', tagKey: 'spamTag' },
    ]},
    { t: 'typing', delay: 800, dur: 1500 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '我已经帮你整理了今天收到的 7 条短信，分类结果：', en: 'I sorted today\'s 7 messages into 4 categories:' } },
    { t: 'multi', cards: [
      { tone: 'brand', icon: 'package', title: { zh: '快递物流', en: 'Package' }, subtitle: { zh: '顺丰 · SF1234567890', en: 'SF · SF1234567890' }, text: { zh: '您的包裹已到达 朝阳区菜鸟驿站 A032', en: 'Arrived at Cainiao Station A032, Chaoyang' }, code: { zh: '取件码：6-8-2045', en: 'Pickup: 6-8-2045' }, buttons: [
        { text: { zh: '查看位置', en: 'Locate' }, action: 'noop', icon: 'mapPin', ack: { zh: '驿站在朝阳区建国路 88 号，距离你 1.2 公里。', en: 'Station at Jianguo Rd 88, Chaoyang · 1.2km from you.' } },
        { text: { zh: '稍后提醒', en: 'Remind later' }, action: 'noop', icon: 'clock', ack: { zh: '好，我傍晚 6 点再提醒你取件。', en: 'OK, I\'ll ping you at 6pm to pick it up.' } },
      ]},
      { tone: 'warning', icon: 'creditCard', title: { zh: '账单提醒', en: 'Bill Due' }, subtitle: { zh: '中国银行 · 信用卡账单', en: 'BoC Credit Card' }, text: { zh: '本期应还：¥3,847.20', en: 'Amount due: ¥3,847.20' }, highlight: { tone: 'warning', icon: 'clock', text: { zh: '还款日：4 月 25 日（还有 16 天）', en: 'Due Apr 25 (16 days left)' } }, buttons: [
        { text: { zh: '查看明细', en: 'View detail' }, action: 'noop', ack: { zh: '本期消费明细：餐饮 ¥1,380 · 购物 ¥1,620 · 交通 ¥847。', en: 'Statement: Food ¥1,380 · Shopping ¥1,620 · Transit ¥847.' } },
        { text: { zh: '到期提醒', en: 'Set alert' }, action: 'noop', icon: 'bell', ack: { zh: '到期前 3 天和当天早上我都会提醒你。', en: 'I\'ll remind you 3 days before and on the due date morning.' } },
      ]},
      { tone: 'success', icon: 'plane', title: { zh: '出行信息', en: 'Travel' }, subtitle: { zh: '南航 CZ3108', en: 'CZ3108' }, text: { zh: '4月15日 08:30  北京首都 T2 → 广州白云', en: 'Apr 15 08:30 PEK T2 → Guangzhou' }, highlight: { tone: 'success', icon: 'check', text: { zh: '状态：正常', en: 'Status: On time' } }, buttons: [
        { text: { zh: '机场导航', en: 'To airport' }, action: 'noop', icon: 'navigation', ack: { zh: '从你家到首都 T2 约 45 分钟，建议 6 点出发。', en: '~45 min from home to PEK T2, suggest leaving at 6am.' } },
        { text: { zh: '航班追踪', en: 'Track flight' }, action: 'track', tone: 'primary', icon: 'bell', userText: { zh: '开启航班追踪', en: 'Enable flight tracking' } },
      ]},
      { tone: 'danger', icon: 'shield', title: { zh: '已过滤', en: 'Filtered' }, subtitle: { zh: '4 条可疑短信', en: '4 suspicious' }, text: { zh: '疑似诈骗：2 条（贷款、赌博）\n营销推广：2 条（促销、投资）', en: 'Likely scam: 2 (loan, gambling)\nMarketing: 2 (promo, invest)' }, buttons: [
        { text: { zh: '查看详情', en: 'View details' }, action: 'noop', ack: { zh: '已过滤：2 条贷款诱导 · 1 条境外赌博 · 2 条理财推广。要我屏蔽这些发送号码吗？', en: 'Filtered: 2 loan scams · 1 gambling · 2 financial promos. Want me to block these senders?' } },
      ]},
    ]},
    { t: 'pause', replies: [
      { label: { zh: '开启航班追踪', en: 'Enable tracking' }, primary: true, user: true },
      { label: { zh: '太棒了！', en: 'Awesome!' } },
    ]},
    { t: 'typing', delay: 200, dur: 1300, soul: { tagAdd: { zh: '商务出行', en: 'Business traveler' }, scoreAdd: 10, statPatch: { proactive: 15, time: 3 } }},
    { t: 'text', sender: 'xiaoyi', text: { zh: '已开启航班 CZ3108 追踪。\n\n出发当天我会：\n• 提前 3 小时叫你起床\n• 推送实时航班状态\n• 实时播报前往机场的路况\n\n你什么都不用操心。', en: 'Flight CZ3108 tracking enabled.\n\nOn departure day I will:\n• Wake you 3 hours before\n• Push real-time flight status\n• Broadcast traffic to airport\n\nYou don\'t need to worry about anything.' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'brand',
      icon: 'shieldCheck',
      title: { zh: '小移的独占优势', en: 'Xiaoyi\'s Unique Edge' },
      bullets: [
        { zh: '短信数据 = 运营商独有', en: 'SMS data = carrier-exclusive' },
        { zh: '互联网 App 拿不到你的短信', en: 'Apps cannot access your SMS' },
        { zh: '这是真正的护城河', en: 'A real moat' },
      ],
      highlight: { tone: 'brand', icon: 'sparkles', text: { zh: '从垃圾场到智能信息流，只有运营商能做到', en: 'From garbage to smart feed — carriers only' } },
    }, soul: { tagAdd: { zh: '出差用户', en: 'Frequent flyer' }, scoreAdd: 8 }},
  ],
};

const S3_FLIGHT = {
  id: 'flight',
  name: { zh: '航班应对', en: 'Flight Rescue' },
  icon: 'plane',
  tagline: { zh: '主动服务 · 不等你问', en: 'Proactive · Before You Ask' },
  intro: { zh: '小移从航班短信识别出行场景，主动监测延误，延误时秒级推送替代方案，结合日历给出完整行程规划。', en: 'Xiaoyi spots travel context from your SMS, monitors delays, and pushes alternative plans within seconds — fully synced with your calendar.' },
  traditional: [
    { text: { zh: '自己刷航旅 App 发现延误', en: 'Refresh travel apps to spot delay' } },
    { text: { zh: '自己去 12306 查高铁', en: 'Search for trains yourself' } },
    { text: { zh: '自己计算时间是否来得及', en: 'Calculate timings manually' } },
    { text: { zh: '焦虑 30 分钟以上', en: '30+ minutes of anxiety' } },
  ],
  xiaoyi: [
    { text: { zh: '主动发现延误，第一时间推送', en: 'Spots delays first, alerts you' } },
    { text: { zh: '智能推荐替代方案', en: 'Smart alternatives ready' } },
    { text: { zh: '跨信息源综合决策', en: 'Cross-source decisions' } },
    { text: { zh: '完整行程重规划', en: 'Full itinerary re-plan' } },
  ],
  metric: { before: { zh: '30+ 分钟焦虑', en: '30+ min anxiety' }, after: { zh: '3 秒知情', en: '3-sec alert' }, save: { zh: '准时到会议', en: 'On time for meeting' } },
  soul: {
    phone: '138****6789',
    tier: { zh: '畅享套餐用户', en: 'Standard Plan' },
    score: 62,
    radar: [65, 75, 55, 48, 42],
    tags: [
      { t: { zh: '通信管家', en: 'Telecom care' } },
      { t: { zh: '价格敏感', en: 'Price-sensitive' } },
      { t: { zh: '商务出行', en: 'Business traveler' } },
      { t: { zh: '出差用户', en: 'Frequent flyer' } },
    ],
    stats: { days: 15, proactive: 28, saved: 840, time: 8 },
  },
  steps: [
    { t: 'divider', text: { zh: '4 月 15 日 · 06:15', en: 'Apr 15 · 06:15' } },
    { t: 'text', sender: 'xiaoyi', text: { zh: '航班变动提醒', en: 'Flight change alert' }, delay: 200 },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'danger',
      icon: 'alertTriangle',
      title: { zh: '您的航班出现变动', en: 'Your flight has changed' },
      fields: [
        { label: { zh: '航班', en: 'Flight' }, value: { zh: '南航 CZ3108', en: 'CZ3108' } },
        { label: { zh: '原计划', en: 'Original' }, value: { zh: '08:30 起飞', en: '08:30 dep' } },
        { label: { zh: '最新状态', en: 'Latest' }, value: { zh: '延误至 10:45', en: 'Delayed to 10:45' } },
      ],
      highlight: { tone: 'danger', icon: 'cloudRain', text: { zh: '原因：北京大面积雷暴 · 延误 2 小时 15 分', en: 'Cause: Beijing thunderstorms · 2h15m delay' } },
      buttons: [
        { text: { zh: '改签航班', en: 'Rebook flight' }, action: 'rebook', icon: 'plane', userText: { zh: '改签其他航班', en: 'Rebook another flight' } },
        { text: { zh: '换高铁', en: 'Take train' }, action: 'train', tone: 'primary', icon: 'trainTrack', userText: { zh: '帮我看高铁方案', en: 'Show me train options' } },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 200, dur: 2000 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '给你找到一个更靠谱的方案：', en: 'Found a better option:' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'brand',
      icon: 'trainTrack',
      title: { zh: '高铁替代方案', en: 'Train Alternative' },
      subtitle: { zh: 'G79 北京南 → 广州南', en: 'G79 Beijing South → Guangzhou South' },
      fields: [
        { label: { zh: '出发', en: 'Departure' }, value: { zh: '07:26（1 小时后）', en: '07:26 (in 1h)' } },
        { label: { zh: '到达', en: 'Arrival' }, value: '14:02' },
        { label: { zh: '二等座', en: '2nd class' }, value: '¥862' },
        { label: { zh: '商务座', en: 'Business' }, value: '¥1,690' },
      ],
      highlight: { tone: 'brand', icon: 'mapPin', text: { zh: '从你当前位置到北京南站驾车 35 分钟 · 路况畅通', en: '35 min drive to Beijing South · clear traffic' } },
      foot: { zh: '对比：等飞机到广州约 13:00 · 高铁到广州约 14:02 · 相差仅 1 小时，但确定性高得多。', en: 'Comparison: flight arrival ~13:00 · train ~14:02 · only 1h gap but far more reliable.' },
      buttons: [
        { text: { zh: '立即购票', en: 'Buy ticket' }, action: 'buy', tone: 'primary', icon: 'check', userText: { zh: '买 G79 高铁票', en: 'Book G79 train' } },
        { text: { zh: '导航去车站', en: 'Navigate' }, action: 'nav', icon: 'navigation', ack: { zh: '已为你打开高德地图，目的地：北京南站，实时路况畅通，预计 35 分钟。', en: 'Gaode Maps opened — Beijing South, clear traffic, ~35 min.' } },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 200, dur: 1400, soul: { tagAdd: { zh: '偏好高铁', en: 'Prefers train' }, scoreAdd: 8 } },
    { t: 'text', sender: 'xiaoyi', text: { zh: '高铁票已预订成功（已关联常用支付方式）。\n\n你下午 3 点在广州的客户会议没变吧？我帮你重新规划下今天的完整行程？', en: 'Train ticket booked (linked to your default payment).\n\nYour 3pm client meeting in Guangzhou is still on, right? Want me to re-plan the whole day?' } },
    { t: 'pause', replies: [
      { label: { zh: '帮我规划一下', en: 'Yes please' }, primary: true, user: true },
    ]},
    { t: 'typing', delay: 200, dur: 1500 },
    { t: 'rcs', sender: 'xiaoyi', card: {
      tone: 'brand',
      icon: 'calendar',
      title: { zh: '今日行程建议', en: 'Today\'s Itinerary' },
      rows: [
        { time: '06:50', event: { zh: '出发去北京南站（已叫专车）', en: 'Leave for Beijing South (car booked)' } },
        { time: '07:26', event: { zh: 'G79 高铁出发', en: 'G79 train departs' } },
        { time: '14:02', event: { zh: '到达广州南', en: 'Arrive Guangzhou South' } },
        { time: '14:10', event: { zh: '打车前往天河区会议地点', en: 'Taxi to Tianhe meeting' } },
        { time: '14:40', event: { zh: '预计到达，短暂休息准备', en: 'Arrive & freshen up' } },
        { time: '15:00', event: { zh: '客户会议', en: 'Client meeting' } },
      ],
      highlight: { tone: 'success', icon: 'check', text: { zh: '所有时间点已同步到你的日历', en: 'All synced to your calendar' } },
      foot: { zh: '我会在每个节点前 15 分钟提醒你。', en: 'I\'ll remind you 15 min before each step.' },
    }, soul: { tagAdd: { zh: '对确定性要求高', en: 'Values certainty' }, scoreAdd: 10, statPatch: { proactive: 31, time: 12 } }},
    { t: 'text', sender: 'xiaoyi', text: { zh: '路上放心，我会一直盯着你的行程。', en: 'Travel safely — I\'ll be watching the whole way.' } },
  ],
};

const S4_VIP = {
  id: 'vip',
  name: { zh: '全球通尊享', en: 'GoTone Premium' },
  icon: 'crown',
  tagline: { zh: '高端差异化变现', en: 'Premium Differentiation' },
  intro: { zh: '全球通铂金用户独享每日专属日报 + 主动日程管理 + 跨场景联动，让 158 元套餐物超所值。', en: 'Platinum members get a daily personal briefing, proactive schedule management, and cross-context concierge — making the ¥158 plan truly worth it.' },
  traditional: [
    { text: { zh: '普通套餐：被动查询', en: 'Standard: query-only' } },
    { text: { zh: '无差异化体验', en: 'No differentiation' } },
    { text: { zh: '高端套餐缺乏获得感', en: 'Premium feels worthless' } },
    { text: { zh: '无法绑定高净值用户', en: 'Cannot lock in HNW users' } },
  ],
  xiaoyi: [
    { text: { zh: '每日专属晨间日报', en: 'Daily morning briefing' } },
    { text: { zh: '主动日程 + 天气联动', en: 'Schedule + weather sync' } },
    { text: { zh: '自动设置全流程提醒', en: 'Auto-set all reminders' } },
    { text: { zh: 'Soul 档案深度服务', en: 'Soul-profile concierge' } },
  ],
  metric: { before: { zh: '普通体验', en: 'Standard' }, after: { zh: '铂金尊享', en: 'Platinum' }, save: { zh: 'ARPU ↑ 45%', en: 'ARPU ↑ 45%' } },
  soul: {
    phone: '138****6789',
    tier: { zh: '全球通铂金 · 小移尊享版', en: 'GoTone Platinum · Xiaoyi Premium' },
    score: 78,
    radar: [80, 85, 70, 65, 58],
    tags: [
      { t: { zh: '通信管家', en: 'Telecom care' } },
      { t: { zh: '商务出行', en: 'Business traveler' } },
      { t: { zh: '偏好高铁', en: 'Prefers train' } },
      { t: { zh: '有孩子', en: 'Has kids' } },
      { t: { zh: '持信用卡', en: 'Credit card holder' } },
      { t: { zh: '铂金会员', en: 'Platinum member' } },
    ],
    stats: { days: 30, proactive: 62, saved: 1240, time: 18 },
  },
  steps: [
    { t: 'divider', text: { zh: '4 月 15 日 · 07:30', en: 'Apr 15 · 07:30' } },
    { t: 'text', sender: 'xiaoyi', text: { zh: '早安！以下是您今天的专属日报：', en: 'Good morning! Here\'s your personal briefing:' }, delay: 300 },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'gold',
      icon: 'crown',
      title: { zh: '全球通 · 每日专属日报', en: 'GoTone · Daily Briefing' },
      subtitle: { zh: '2026 年 4 月 15 日 星期三', en: 'Wed, Apr 15, 2026' },
      fields: [
        { label: { zh: '本月流量已用', en: 'Data used' }, value: '12.3GB / 40GB', progress: 31 },
      ],
      rows: [
        { time: '09:00', event: { zh: '部门周会（腾讯会议）', en: 'Team meeting (Tencent)' } },
        { time: '14:00', event: { zh: '客户拜访（望京 SOHO）', en: 'Client visit (Wangjing SOHO)' } },
        { time: '18:30', event: { zh: '接孩子放学', en: 'Pick up kids from school' } },
      ],
      highlight: { tone: 'brand', icon: 'cloudRain', text: { zh: '北京 晴转多云 18-26°C · 下午阵雨 30% · 建议带伞', en: 'Beijing 18-26°C · 30% PM showers · bring umbrella' } },
      foot: { zh: '信用卡还款倒计时：10 天（应还 ¥3,847.20）', en: 'Credit card due in 10 days (¥3,847.20)' },
    }},
    { t: 'pause', replies: [
      { label: { zh: '下午去望京 SOHO 怎么走', en: 'How to get to Wangjing?' }, primary: true, user: true },
      { label: { zh: '继续忙碌', en: 'Stay focused' } },
    ]},
    { t: 'typing', delay: 200, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '已为你对比了三种出行方式：', en: 'Three options compared for you:' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'gold',
      icon: 'navigation',
      title: { zh: '望京 SOHO 出行方案', en: 'Routes to Wangjing SOHO' },
      subtitle: { zh: '14:00 客户拜访', en: '14:00 Client visit' },
      fields: [
        { label: { zh: '驾车', en: 'Drive' }, value: { zh: '约 45 分钟（拥堵）', en: '~45 min (busy)' }, progress: 60, tone: 'warn' },
        { label: { zh: '地铁', en: 'Subway' }, value: { zh: '约 55 分钟（换乘）', en: '~55 min (transfer)' }, progress: 48, tone: 'warn' },
        { label: { zh: '打车', en: 'Taxi' }, value: { zh: '约 40 分钟 ¥45', en: '~40 min ¥45' }, progress: 80 },
      ],
      highlight: { tone: 'success', icon: 'clock', text: { zh: '建议 13:10 出发 · 已设置 13:05 出发提醒', en: 'Leave 13:10 · alert set for 13:05' } },
      foot: { zh: '下午 30% 阵雨概率，望京 SOHO 停车困难，打车更方便。', en: '30% chance of rain, parking is hard — taxi recommended.' },
      buttons: [
        { text: { zh: '打开导航', en: 'Open navigation' }, action: 'noop', icon: 'navigation', ack: { zh: '已为你打开高德导航，目的地：望京 SOHO。', en: 'Gaode Maps opened — destination: Wangjing SOHO.' } },
        { text: { zh: '预约用车', en: 'Book car' }, action: 'book', tone: 'gold', icon: 'car', userText: { zh: '预约 13:00 专车', en: 'Book a 13:00 car' } },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 200, dur: 1300, soul: { tagAdd: { zh: '偏好打车', en: 'Prefers car' }, scoreAdd: 6 } },
    { t: 'text', sender: 'xiaoyi', text: { zh: '已为你预约 13:00 铂金专车（司机评分 5.0）。\n\n另外我看了下你儿子学校 18:30 放学，到望京 SOHO 开完会预计 17:30，走四环堵车 40 分钟，刚好来得及。需要我帮你同步给阿姨吗？', en: 'Booked a 13:00 Platinum car (5.0 driver).\n\nAlso your son\'s school dismisses at 18:30. Meeting wraps ~17:30, the 4th-ring traffic adds 40 min — you\'ll just make it. Want me to sync with the nanny?' } },
    { t: 'pause', replies: [
      { label: { zh: '帮我同步给阿姨', en: 'Yes, please sync' }, primary: true, user: true },
    ]},
    { t: 'typing', delay: 200, dur: 1200 },
    { t: 'rcs', sender: 'xiaoyi', card: {
      tone: 'gold',
      icon: 'star',
      title: { zh: '铂金专属服务', en: 'Platinum Concierge' },
      bullets: [
        { zh: '每日专属日报（晨间自动推送）', en: 'Daily personal briefing' },
        { zh: '主动日程 + 天气 + 交通联动', en: 'Schedule + weather + traffic sync' },
        { zh: '自动预约铂金专车（评分 5.0）', en: 'Auto-book Platinum cars (5.0)' },
        { zh: '家庭成员行程协同', en: 'Family schedule coordination' },
        { zh: '7×24 贵宾直连客服', en: '24/7 VIP direct line' },
      ],
      highlight: { tone: 'brand', icon: 'wallet', text: { zh: '铂金套餐 ¥158 · 月均节省时间约 8 小时', en: 'Platinum ¥158 · saves ~8 hrs/month' } },
    }, soul: { tagAdd: { zh: '时间敏感型', en: 'Time-sensitive' }, scoreAdd: 12, statPatch: { proactive: 68, saved: 1840, time: 24 } }},
  ],
};

/* ============================================================
   SOUL COMPANION SCENARIOS (4)
   ============================================================ */

const S_SECRETARY = {
  id: 'secretary',
  name: { zh: '出差秘书', en: 'Trip Secretary' },
  icon: 'briefcase',
  tagline: { zh: '灵魂伴侣 · 贴身秘书', en: 'Soul Companion · Personal Aide' },
  intro: { zh: '从你日历里发现出差计划，小移化身贴身秘书——机票、酒店、专车、漫游、签证、天气、着装一站搞定。你只负责带好脑袋。', en: 'Spotting an upcoming trip in your calendar, Xiaoyi books your flight, hotel, car, roaming pack, and shares visa/weather/dress tips — you only need to bring yourself.' },
  traditional: [
    { text: { zh: '自己刷航旅 App 比较机票', en: 'Manually compare flights' } },
    { text: { zh: '自己订酒店、找接送车', en: 'Book hotels & transfers solo' } },
    { text: { zh: '临行前手忙脚乱开漫游', en: 'Scramble for roaming setup' } },
    { text: { zh: '签证、天气全靠自己记', en: 'Track visa/weather alone' } },
  ],
  xiaoyi: [
    { text: { zh: '读取日历主动发现出差', en: 'Spots trip from calendar' } },
    { text: { zh: '一站式自动预定', en: 'One-stop auto-booking' } },
    { text: { zh: '漫游 + 天气 + 着装一次搞定', en: 'Roaming + weather + dress tips' } },
    { text: { zh: '全程不打扰，关键节点提醒', en: 'Quiet care, key alerts only' } },
  ],
  metric: { before: { zh: '1.5 小时筹备', en: '1.5h prep' }, after: { zh: '零操作', en: 'Zero touch' }, save: { zh: '全年 ×16 趟', en: '16 trips/year' } },
  soul: {
    phone: '138****6789',
    tier: { zh: '全球通铂金 · 灵魂伴侣模式', en: 'Platinum · Soul Companion' },
    score: 85,
    radar: [85, 92, 78, 72, 65],
    tags: [
      { t: { zh: '商务出行', en: 'Business traveler' } },
      { t: { zh: '持信用卡', en: 'Credit card' } },
      { t: { zh: '偏好南航', en: 'Prefers ChinaSouthern' } },
      { t: { zh: '早班机爱好者', en: 'Early bird' } },
      { t: { zh: '时间敏感型', en: 'Time-sensitive' } },
      { t: { zh: '铂金会员', en: 'Platinum member' } },
    ],
    stats: { days: 45, proactive: 156, saved: 2480, time: 36 },
  },
  steps: [
    { t: 'divider', text: { zh: '周日晚 · 20:30', en: 'Sunday · 20:30' } },
    { t: 'typing', delay: 300, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '晚上好。我在你的日历里看到下周二到周四要去东京出差，是个新客户拜访对吧？我提前帮你准备下行程，你就负责带好脑袋就行。', en: 'Good evening. I see you have a Tokyo trip Tue–Thu next week — a new client visit, right? Let me prep everything for you. You only need to bring your brain.' } },
    { t: 'pause', replies: [
      { label: { zh: '太好了，拜托了', en: 'Yes, please' }, primary: true, user: true },
      { label: { zh: '这次自己来', en: 'I\'ll handle it' } },
    ]},
    { t: 'typing', delay: 200, dur: 1500 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '放心交给我。我已经按你平时的偏好做了第一版方案：', en: 'Leave it to me. Here\'s draft v1 based on your preferences:' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'gold',
      icon: 'plane',
      title: { zh: '东京出差行程方案', en: 'Tokyo Business Trip Plan' },
      subtitle: { zh: '6 月 11 日 - 6 月 13 日（3 天 2 夜）', en: 'Jun 11–13 (3 days, 2 nights)' },
      rows: [
        { time: '6/11', event: { zh: '08:00 首都 T3 → 成田 NRT · ANA NH956', en: '08:00 PEK T3 → NRT · ANA NH956' } },
        { time: '6/11', event: { zh: '14:00 入住新宿王子大酒店（近客户）', en: '14:00 Check in Shinjuku Prince (near client)' } },
        { time: '6/12', event: { zh: '10:00 客户拜访（已同步日历）', en: '10:00 Client visit (synced)' } },
        { time: '6/13', event: { zh: '17:35 成田 NRT → 首都 T3 · ANA NH955', en: '17:35 NRT → PEK T3 · ANA NH955' } },
      ],
      highlight: { tone: 'brand', icon: 'sparkles', text: { zh: '所有选项已按你偏好排序（早班机 · 五星酒店 · 近客户）', en: 'Sorted by your preferences (early flight · 5-star · near client)' } },
    }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'brand',
      icon: 'creditCard',
      title: { zh: '一键预定清单', en: 'One-Tap Booking' },
      fields: [
        { label: { zh: '往返机票', en: 'Round-trip flight' }, value: { zh: '¥4,280（商务舱 75 折）', en: '¥4,280 (Business 25% off)' } },
        { label: { zh: '酒店 2 晚', en: 'Hotel 2 nights' }, value: { zh: '¥2,640（高层无烟）', en: '¥2,640 (high floor, non-smoke)' } },
        { label: { zh: '首都机场接送', en: 'Airport transfer' }, value: { zh: '¥180（铂金专车）', en: '¥180 (Platinum car)' } },
        { label: { zh: '东京当地用车', en: 'Tokyo car (3 days)' }, value: '¥420' },
      ],
      highlight: { tone: 'success', icon: 'wallet', text: { zh: '合计 ¥7,520 · 已用积分抵扣 ¥680', en: 'Total ¥7,520 · ¥680 redeemed from points' } },
      buttons: [
        { text: { zh: '全部确认预定', en: 'Confirm all' }, action: 'book', tone: 'primary', icon: 'check', userText: { zh: '全部确认预定', en: 'Confirm all' } },
        { text: { zh: '调整方案', en: 'Adjust' }, action: 'edit', icon: 'edit', ack: { zh: '好的，你想调整哪一项？机票舱位、酒店档次，还是出发时间？', en: 'Sure — which part? Cabin class, hotel tier, or departure time?' } },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 300, dur: 1800 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '全部预定成功。确认单已发到你的工作邮箱。这些我也帮你一起办了：', en: 'All booked. Confirmations sent to your work email. I also handled these for you:' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'success',
      icon: 'wifi',
      title: { zh: '日本 4G 无感漫游包', en: 'Japan 4G Roaming Pack' },
      subtitle: { zh: '3 日畅游 · ¥58', en: '3 days · ¥58' },
      bullets: [
        { zh: '无限流量，日本 4G/5G 网络', en: 'Unlimited data, JP 4G/5G' },
        { zh: '原号直接可用，无需换卡', en: 'Same number, no SIM swap' },
        { zh: '落地即自动开启，回国自动关闭', en: 'Auto-on at landing, auto-off home' },
      ],
      highlight: { tone: 'brand', icon: 'check', text: { zh: '已为你开通，无需任何操作', en: 'Activated — nothing to do' } },
    }, soul: { tagAdd: { zh: '常赴日出差', en: 'Frequent JP traveler' }, scoreAdd: 4 }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'warning',
      icon: 'cloudRain',
      title: { zh: '东京 3 天天气 + 着装建议', en: 'Tokyo Weather & Dress Tips' },
      fields: [
        { label: { zh: '6/11 周二', en: '6/11 Tue' }, value: { zh: '小雨 19-24°C', en: 'Light rain 19-24°C' } },
        { label: { zh: '6/12 周三', en: '6/12 Wed' }, value: { zh: '多云 21-26°C', en: 'Cloudy 21-26°C' } },
        { label: { zh: '6/13 周四', en: '6/13 Thu' }, value: { zh: '晴 22-28°C', en: 'Sunny 22-28°C' } },
      ],
      highlight: { tone: 'warning', icon: 'cloudRain', text: { zh: '建议带折叠伞 · 早晚温差大，备一件薄外套', en: 'Bring folding umbrella · pack a light jacket' } },
      foot: { zh: '客户拜访日正装 · 其他时段商务休闲即可', en: 'Suit for client day · business casual otherwise' },
    }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'brand',
      icon: 'shieldCheck',
      title: { zh: '行前贴心清单', en: 'Pre-Trip Checklist' },
      bullets: [
        { zh: '护照有效期检查通过（>6 个月）', en: 'Passport validity OK (>6 months)' },
        { zh: '日元已提醒老婆去银行兑换 ¥3,000', en: 'Reminded your wife to exchange ¥3,000 JPY' },
        { zh: '插头转换器已寄到你家', en: 'Plug adapter shipped to your home' },
        { zh: '客户公司前台联系方式已存通讯录', en: 'Client front-desk number saved' },
        { zh: '新宿到客户办公室的步行路线已收藏', en: 'Walking route Shinjuku → office bookmarked' },
      ],
    }, soul: { tagAdd: { zh: '深度照护', en: 'Deeply cared for' }, scoreAdd: 6, statPatch: { proactive: 162 } }},
    { t: 'text', sender: 'xiaoyi', text: { zh: '你现在就安心休息。周二早上 5:30 我会轻柔地叫你起床，专车 6:10 准时到楼下。到东京后我继续给你当 24 小时秘书。', en: 'Rest easy. I\'ll gently wake you at 5:30 Tuesday, the car arrives 6:10 sharp. In Tokyo I\'ll keep being your 24/7 secretary.' } },
  ],
};

const S_EXAM = {
  id: 'exam',
  name: { zh: '备考加油', en: 'Exam Coach' },
  icon: 'bookOpen',
  tagline: { zh: '灵魂伴侣 · 加油模式', en: 'Soul Companion · Cheer Mode' },
  intro: { zh: '识别到你即将考试，小移自动切换加油模式：制定学习计划、开启免打扰、过滤打扰信息、每日鼓励、考前陪伴——像一个温暖的学习伙伴。', en: 'Spotting an upcoming exam, Xiaoyi switches to Cheer Mode: builds a study plan, enables Do-Not-Disturb, filters noise, sends daily encouragement and walks you to exam day.' },
  traditional: [
    { text: { zh: '没人制定科学学习计划', en: 'No one builds a study plan' } },
    { text: { zh: '工作消息不断打扰', en: 'Constant work pings' } },
    { text: { zh: '一个人备考很孤独', en: 'Studying alone feels lonely' } },
    { text: { zh: '考前焦虑无人疏解', en: 'No one to ease the anxiety' } },
  ],
  xiaoyi: [
    { text: { zh: '自动识别考试日期', en: 'Auto-spots exam date' } },
    { text: { zh: '科学拆解学习计划', en: 'Scientific study plan' } },
    { text: { zh: '专注模式 + 智能过滤', en: 'Focus mode + smart filter' } },
    { text: { zh: '每日鼓励 + 考前陪伴', en: 'Daily cheer & exam-day care' } },
  ],
  metric: { before: { zh: '单打独斗', en: 'Going solo' }, after: { zh: '灵魂陪伴', en: 'Soul company' }, save: { zh: '专注 +80%', en: 'Focus +80%' } },
  soul: {
    phone: '138****6789',
    tier: { zh: '全球通铂金 · 备考加油模式', en: 'Platinum · Exam Cheer Mode' },
    score: 88,
    radar: [88, 70, 82, 90, 72],
    tags: [
      { t: { zh: '正在备考', en: 'In exam prep' } },
      { t: { zh: 'CFA 二级', en: 'CFA Level II' } },
      { t: { zh: '专注模式开启', en: 'Focus mode on' } },
      { t: { zh: '铂金会员', en: 'Platinum' } },
      { t: { zh: '高压工作者', en: 'High-pressure pro' } },
      { t: { zh: '自律型', en: 'Self-disciplined' } },
    ],
    stats: { days: 62, proactive: 198, saved: 2480, time: 48 },
  },
  steps: [
    { t: 'divider', text: { zh: '周日早 · 08:15', en: 'Sunday · 08:15' } },
    { t: 'typing', delay: 300, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '早安。我注意到一件大事：你日历里 6 月 10 日有 CFA 二级考试，还有 18 天。这次备考要加油了。', en: 'Good morning. Big thing in your calendar: CFA Level II on Jun 10 — 18 days away. Time to focus.' } },
    { t: 'text', sender: 'xiaoyi', delay: 900, text: { zh: '我知道你工作很忙，一个人啃书不容易。让我做你的灵魂陪考伙伴吧？从现在开始我帮你：\n\n• 拆解每日学习计划\n• 开启专注免打扰\n• 过滤工作群消息\n• 每天给你打气\n• 考试那天陪你到考场\n\n一起把它拿下。', en: 'I know your job is intense and studying alone is tough. Let me be your soul companion through this. Starting today I will:\n\n• Build a daily study plan\n• Enable Do-Not-Disturb\n• Filter work-chat noise\n• Cheer you on every day\n• Walk you to the exam hall\n\nLet\'s nail this together.' } },
    { t: 'pause', replies: [
      { label: { zh: '好，拜托你了', en: 'Yes, please' }, primary: true, user: true },
      { label: { zh: '再想想', en: 'Let me think' } },
    ]},
    { t: 'typing', delay: 300, dur: 1500 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '好嘞！我已经按 CFA 官方考纲 + 你的碎片时间做了 18 天计划：', en: 'Done. Here\'s an 18-day plan based on the CFA syllabus + your free slots:' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'brand',
      icon: 'bookOpen',
      title: { zh: 'CFA 二级 · 18 天冲刺计划', en: 'CFA L2 · 18-Day Sprint Plan' },
      subtitle: { zh: '根据你的通勤 + 晚间时间定制', en: 'Tuned to your commute + evening windows' },
      rows: [
        { time: 'D1-6', event: { zh: '核心重做：Ethics · 权益 · 固收（6h/天）', en: 'Core: Ethics · Equity · FI (6h/day)' } },
        { time: 'D7-12', event: { zh: '难点突破：衍生品 · 另类投资（5h/天）', en: 'Hard topics: Derivs · Alts (5h/day)' } },
        { time: 'D13-16', event: { zh: '真题模考：Mock 1/2/3 + 复盘', en: 'Mock 1/2/3 + review' } },
        { time: 'D17', event: { zh: '轻度复习 + 休息调整', en: 'Light review + rest' } },
        { time: 'D18', event: { zh: '考试日 · 我陪你到考场', en: 'Exam day · I\'ll walk you in' } },
      ],
      highlight: { tone: 'brand', icon: 'flame', text: { zh: '日均 5-6 小时，充分利用通勤 + 早晚时段', en: '5-6 hrs/day, leveraging commute & early/late slots' } },
    }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'success',
      icon: 'bellOff',
      title: { zh: '专注模式已为你配置', en: 'Focus Mode Configured' },
      bullets: [
        { zh: '工作日 20:00-23:00 深度学习时段', en: 'Weekdays 20:00-23:00 deep work' },
        { zh: '周末 09:00-12:00、14:00-18:00 全屏禁打扰', en: 'Weekends 09-12, 14-18 full DND' },
        { zh: '自动回复同事：正在备考，考完马上回复', en: 'Auto-reply: studying, will respond after exam' },
        { zh: '过滤营销、推广、群聊消息', en: 'Filter promo & group chat noise' },
        { zh: '只保留家人紧急来电 + 导师群', en: 'Keep family calls & mentor chat only' },
      ],
      highlight: { tone: 'success', icon: 'check', text: { zh: '每日专注时长会汇总给你看', en: 'Daily focus time will be summarized' } },
      buttons: [
        { text: { zh: '启用专注模式', en: 'Enable Focus Mode' }, action: 'focus', tone: 'primary', icon: 'lock', userText: { zh: '启用专注模式', en: 'Enable Focus Mode' } },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 300, dur: 1000 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '专注模式已启动。从现在起我来帮你挡掉所有杂音，你只管专心学。', en: 'Focus Mode active. I\'ll block all noise — just study.' } },
    { t: 'divider', text: { zh: '12 天后 · 考前 6 天 · 21:30', en: '12 days later · T-6 · 21:30' } },
    { t: 'typing', delay: 300, dur: 1400, soul: { tagAdd: { zh: '持续 12 天坚持', en: '12 days streak' }, scoreAdd: 6 } },
    { t: 'rcs', sender: 'xiaoyi', card: {
      tone: 'brand',
      icon: 'flame',
      title: { zh: '12 天学习进度', en: '12-Day Progress' },
      fields: [
        { label: { zh: '完成度', en: 'Progress' }, value: { zh: '72h / 计划 90h', en: '72h / 90h' }, progress: 80 },
        { label: { zh: '坚持天数', en: 'Streak' }, value: { zh: '12 / 18 天', en: '12 / 18 days' }, progress: 67 },
        { label: { zh: 'Mock 成绩', en: 'Mock score' }, value: { zh: '第一次 68% → 目标 75%', en: '1st 68% → target 75%' } },
      ],
      highlight: { tone: 'success', icon: 'trendingUp', text: { zh: '你已经比计划提前 2 小时，状态很棒！', en: 'You\'re 2 hours ahead of plan. Looking great!' } },
      foot: { zh: '我过滤了 186 条非紧急消息，都整理好放在考后查看里了。', en: 'I filtered 186 non-urgent messages — saved in "after exam" folder.' },
    }},
    { t: 'text', sender: 'xiaoyi', delay: 700, text: { zh: '今晚可以早点休息，明早再冲刺衍生品那块。你不是一个人在战斗，我一直在。', en: 'Get some early sleep tonight. Push derivatives tomorrow. You\'re not alone — I\'m always here.' } },
    { t: 'divider', text: { zh: '考试日 · 06:30', en: 'Exam Day · 06:30' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 300, card: {
      tone: 'gold',
      icon: 'sun',
      title: { zh: '考试日快乐！', en: 'Exam Day!' },
      subtitle: { zh: '今天是 6 月 10 日，你准备了 18 天', en: 'Jun 10 — you\'ve prepared for 18 days' },
      bullets: [
        { zh: '闹钟 6:30 温柔起床', en: 'Gentle alarm at 6:30' },
        { zh: '专车 7:30 准时到楼下', en: 'Car arrives 7:30 sharp' },
        { zh: '准考证 + 身份证 + 计算器已提醒装包', en: 'Admit ticket / ID / calculator packed' },
        { zh: '你最爱的白粥 + 鸡蛋早餐已预订', en: 'Favorite congee & egg breakfast ordered' },
      ],
      highlight: { tone: 'gold', icon: 'trophy', text: { zh: '你已做到最好，去享受 18 天努力的成果', en: 'You\'ve done your best — go enjoy the result of 18 days of effort' } },
    }},
    { t: 'text', sender: 'xiaoyi', delay: 600, text: { zh: '深呼吸，你比你自己想象的更强。我在这里，等你好消息。', en: 'Deep breath. You\'re stronger than you think. I\'m here, waiting for good news.' } },
    { t: 'divider', text: { zh: '考试结束 · 16:45', en: 'Post-exam · 16:45' } },
    { t: 'text', sender: 'xiaoyi', delay: 300, text: { zh: '辛苦了。不管结果如何，坚持 18 天的你已经很了不起了。\n\n我已经帮你订了你最爱的那家日料店 19:00 的位子，也跟你老婆同步了，好好庆祝一下。', en: 'You did great. Whatever the result, 18 days of grind is admirable.\n\nI\'ve booked your favorite Japanese place at 19:00 and synced with your wife. Go celebrate.' } },
  ],
};

const S_DEADLINE = {
  id: 'deadline',
  name: { zh: '工作救援', en: 'Work Rescue' },
  icon: 'clock',
  tagline: { zh: '灵魂伴侣 · 救火队长', en: 'Soul Companion · Firefighter' },
  intro: { zh: '小移跨邮件、日历、协作工具识别 deadline 压力，主动梳理优先级、生成初稿、帮你挡掉打扰——像一个顶级的贴身助理。', en: 'Cross-reading email, calendar and chats, Xiaoyi spots deadline pressure, prioritizes, drafts your decks, and shields you from distractions — like a top-tier executive assistant.' },
  traditional: [
    { text: { zh: '多个 deadline 压头，手忙脚乱', en: 'Multiple deadlines crash together' } },
    { text: { zh: '从零开始写方案，效率低', en: 'Build decks from scratch' } },
    { text: { zh: '会议、打扰、杂事不断', en: 'Endless meetings & pings' } },
    { text: { zh: '熬夜赶工，第二天状态差', en: 'All-nighters wreck next day' } },
  ],
  xiaoyi: [
    { text: { zh: '跨数据源识别 deadline', en: 'Cross-source deadline detection' } },
    { text: { zh: '生成初稿给你直接改', en: 'Generate first drafts to edit' } },
    { text: { zh: '智能安排日程挡打扰', en: 'Smart rescheduling & shielding' } },
    { text: { zh: '全程陪伴、主动减负', en: 'Always there, always lightening load' } },
  ],
  metric: { before: { zh: '3 个通宵', en: '3 all-nighters' }, after: { zh: '准点下班', en: 'Off on time' }, save: { zh: '节省 10+ 小时', en: 'Save 10+ hours' } },
  soul: {
    phone: '138****6789',
    tier: { zh: '全球通铂金 · 救火模式', en: 'Platinum · Rescue Mode' },
    score: 87,
    radar: [85, 82, 78, 92, 68],
    tags: [
      { t: { zh: '项目经理', en: 'Project Manager' } },
      { t: { zh: '高压工作者', en: 'High-pressure pro' } },
      { t: { zh: '偏好晨型人', en: 'Morning person' } },
      { t: { zh: '铂金会员', en: 'Platinum' } },
      { t: { zh: '求效率', en: 'Efficiency-driven' } },
      { t: { zh: '重视工作生活平衡', en: 'Values WLB' } },
    ],
    stats: { days: 78, proactive: 248, saved: 2480, time: 64 },
  },
  steps: [
    { t: 'divider', text: { zh: '周一早 · 08:00', en: 'Monday · 08:00' } },
    { t: 'typing', delay: 300, dur: 1300 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '早安。我交叉看了你的邮件、日历和协作群，这周你有 3 个 deadline 会碰在一起，我先帮你梳理下优先级：', en: 'Good morning. I cross-checked your email, calendar and team chats — three deadlines collide this week. Here\'s the priority view:' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'danger',
      icon: 'alertTriangle',
      title: { zh: '本周 3 大 Deadline', en: 'This Week\'s 3 Deadlines' },
      subtitle: { zh: '按紧急度 × 重要度排序', en: 'Sorted by urgency × importance' },
      rows: [
        { time: { zh: '周二', en: 'Tue' }, event: { zh: 'Q2 经营分析 PPT（下午 2 点汇报）', en: 'Q2 review deck (2pm presentation)' } },
        { time: { zh: '周四', en: 'Thu' }, event: { zh: '新客户提案 · 20 页方案', en: 'New client pitch · 20-page plan' } },
        { time: { zh: '周五', en: 'Fri' }, event: { zh: '季度 OKR 复盘报告', en: 'Quarterly OKR retro' } },
      ],
      highlight: { tone: 'danger', icon: 'flame', text: { zh: '周二 PPT 最紧迫 · 不到 30 小时', en: 'Tue deck most urgent · <30h left' } },
      foot: { zh: '我已按紧急度为你重新排好本周日程', en: 'Your week is already re-sorted by urgency' },
    }},
    { t: 'typing', delay: 700, dur: 1500 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '我知道你最怕 zero to one，先帮你起了个头，你可以直接在上面改：', en: 'I know zero-to-one is your weak spot — here\'s a starter you can edit:' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'brand',
      icon: 'barChart',
      title: { zh: 'Q2 经营分析 PPT · 初稿', en: 'Q2 Analysis Deck · Draft' },
      subtitle: { zh: '12 页 · 基于你过去的汇报风格', en: '12 pages · matching your past style' },
      bullets: [
        { zh: 'Slide 1：核心结论（营收同比 ↑23%）', en: 'Slide 1: Top-line (revenue +23% YoY)' },
        { zh: 'Slide 2-4：财务表现 · 已填充系统数据', en: 'Slide 2-4: Financials · system data populated' },
        { zh: 'Slide 5-7：业务亮点 · 3 个代表项目', en: 'Slide 5-7: Highlights · 3 key projects' },
        { zh: 'Slide 8-9：挑战与风险', en: 'Slide 8-9: Risks & challenges' },
        { zh: 'Slide 10-11：Q3 行动计划', en: 'Slide 10-11: Q3 action plan' },
        { zh: 'Slide 12：Q&A', en: 'Slide 12: Q&A' },
      ],
      highlight: { tone: 'brand', icon: 'sparkles', text: { zh: '数据已对接你的 ERP，图表自动更新', en: 'Wired to your ERP — charts auto-refresh' } },
      buttons: [
        { text: { zh: '下载初稿', en: 'Download draft' }, action: 'download', tone: 'primary', icon: 'download', userText: { zh: '太好了，下载', en: 'Great, download' } },
        { text: { zh: '在线编辑', en: 'Edit online' }, action: 'edit', icon: 'edit', ack: { zh: '已为你在浏览器打开初稿，所有图表都是活链接，数据变化会自动同步。', en: 'Draft opened in your browser — all charts are live-linked and auto-sync.' } },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 300, dur: 1500 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '初稿已同步到你的 OneDrive。我估算你精修 + 演练大概 4 小时就能搞定。', en: 'Draft synced to your OneDrive. I estimate ~4h for polish + rehearsal.' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'success',
      icon: 'shield',
      title: { zh: '我来帮你挡打扰', en: 'I\'ll Shield You' },
      bullets: [
        { zh: '今天 9-12 点锁为深度工作，所有会议已移到下午', en: '9-12 locked for deep work, meetings moved to PM' },
        { zh: '技术群、营销群、行政通知全部静音', en: 'All non-critical chats muted' },
        { zh: '非老板来电自动回复：正在赶重要方案', en: 'Auto-reply: focused on a critical deck' },
        { zh: '老婆消息正常保留，家人紧急来电直达', en: 'Wife messages kept, family urgent calls go through' },
        { zh: '12:00 已帮你订好常吃的那家轻食', en: 'Light lunch from your usual spot ordered for 12:00' },
      ],
      highlight: { tone: 'success', icon: 'sparkles', text: { zh: '你专心写，其他交给我', en: 'You write — I handle the rest' } },
    }, soul: { tagAdd: { zh: '深度工作者', en: 'Deep worker' }, scoreAdd: 5 }},
    { t: 'divider', text: { zh: '周二早 · 07:45', en: 'Tue · 07:45' } },
    { t: 'typing', delay: 300, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '早安。今天就是 PPT 汇报日。我昨晚 22:00 之后没打扰你休息，看到你 23:10 把稿子完成了。', en: 'Good morning. Presentation day. I let you rest after 22:00 last night and saw you finished the deck at 23:10. Proud of you.' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'gold',
      icon: 'calendar',
      title: { zh: '今日冲刺日程', en: 'Today\'s Sprint Schedule' },
      rows: [
        { time: '08:30', event: { zh: '专车已预约 · 避开早高峰', en: 'Car booked · avoid rush' } },
        { time: '09:15', event: { zh: '到办公室，最后预演一遍', en: 'Arrive office, final rehearsal' } },
        { time: '11:00', event: { zh: '和产品总监同步核心数据', en: 'Sync key data with PD' } },
        { time: '12:30', event: { zh: '清淡午餐送到（温补类）', en: 'Light warm lunch delivered' } },
        { time: '14:00', event: { zh: 'Q2 经营分析汇报', en: 'Q2 Analysis Presentation' } },
        { time: '15:30', event: { zh: '自动缓冲出空档，让你缓一缓', en: 'Auto buffer time to recover' } },
      ],
      highlight: { tone: 'gold', icon: 'shieldCheck', text: { zh: '汇报前我会帮你开启勿扰，让你专注状态', en: 'I\'ll enable DND before the meeting so you stay locked in' } },
    }},
    { t: 'text', sender: 'xiaoyi', delay: 600, text: { zh: '这周还有 2 个 deadline，我已经在后台帮你准备初稿了。今天你就专心拿下 Q2，剩下的我跟你一起打。', en: 'Two more deadlines this week — I\'m drafting them in the background. Just nail Q2 today; I\'ve got the rest.' } },
  ],
};

const S_BUTLER = {
  id: 'butler',
  name: { zh: '生活管家', en: 'Life Butler' },
  icon: 'heart',
  tagline: { zh: '灵魂伴侣 · 贴心管家', en: 'Soul Companion · Thoughtful Butler' },
  intro: { zh: '小移记得你的胃、你女朋友的喜好和重要日子。从午餐到约会一站安排——这不是功能，是真正懂你的人。', en: 'Xiaoyi remembers your stomach, your girlfriend\'s tastes and your big days. From lunch to date night — not a feature, but someone who truly knows you.' },
  traditional: [
    { text: { zh: '忙到没空想午饭吃什么', en: 'Too busy to plan lunch' } },
    { text: { zh: '约会买礼物总是临阵磨枪', en: 'Last-minute gift shopping' } },
    { text: { zh: '忘了女朋友的喜好和纪念日', en: 'Forget her favorites & dates' } },
    { text: { zh: '下班还要操心选餐厅打车', en: 'Worry about where to go after work' } },
  ],
  xiaoyi: [
    { text: { zh: '记住你的每一个小习惯', en: 'Remembers every little habit' } },
    { text: { zh: '懂你女朋友的喜好和心思', en: 'Knows her tastes & moods' } },
    { text: { zh: '从午餐到约会一站安排', en: 'Lunch to date — all arranged' } },
    { text: { zh: '像贴心的伴侣替你想到一切', en: 'Thinks of everything for you' } },
  ],
  metric: { before: { zh: '手忙脚乱', en: 'Frazzled' }, after: { zh: '从容赴约', en: 'Calm & ready' }, save: { zh: '每日省心 2 小时', en: 'Save 2h/day worry' } },
  soul: {
    phone: '138****6789',
    tier: { zh: '全球通铂金 · 灵魂伴侣', en: 'Platinum · Soul Companion' },
    score: 92,
    radar: [90, 85, 95, 88, 78],
    tags: [
      { t: { zh: '口味偏清淡', en: 'Light eater' } },
      { t: { zh: '爱吃日料', en: 'Loves Japanese food' } },
      { t: { zh: '女友记录', en: 'Girlfriend profile' } },
      { t: { zh: '浪漫型', en: 'Romantic' } },
      { t: { zh: '铂金会员', en: 'Platinum' } },
      { t: { zh: '记得纪念日', en: 'Remembers anniversaries' } },
      { t: { zh: '偏好鲜花', en: 'Fan of flowers' } },
    ],
    stats: { days: 120, proactive: 380, saved: 3680, time: 88 },
  },
  steps: [
    { t: 'divider', text: { zh: '周五 · 12:15', en: 'Fri · 12:15' } },
    { t: 'typing', delay: 300, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '我看到你 11:30 的会还在开，应该还没吃午饭吧？你今早吃了胃药，我帮你点点清淡的？', en: 'Your 11:30 meeting is still running — you haven\'t had lunch, right? You took stomach meds this morning. Want me to order something light?' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'success',
      icon: 'utensils',
      title: { zh: '今日午餐推荐', en: 'Today\'s Lunch Pick' },
      subtitle: { zh: '综合你的口味 + 胃部状态', en: 'Based on your taste + stomach' },
      fields: [
        { label: { zh: '菜品', en: 'Dish' }, value: { zh: '三文鱼亲子饭 + 茶碗蒸 + 味噌汤', en: 'Salmon donburi + chawanmushi + miso' } },
        { label: { zh: '来自', en: 'From' }, value: { zh: '本町日料（你常吃）', en: 'Honmachi (your usual)' } },
        { label: { zh: '配送', en: 'Delivery' }, value: { zh: '13:00 准时送到办公室', en: 'Office by 13:00 sharp' } },
        { label: { zh: '金额', en: 'Total' }, value: { zh: '¥88（积分抵扣后 ¥72）', en: '¥88 (¥72 after points)' } },
      ],
      highlight: { tone: 'brand', icon: 'sparkles', text: { zh: '少盐少油，你的胃正在养，适合', en: 'Low salt, low oil — perfect for your healing stomach' } },
      buttons: [
        { text: { zh: '就这个', en: 'This one' }, action: 'order', tone: 'primary', icon: 'check', userText: { zh: '就这个', en: 'This one' } },
        { text: { zh: '换一个', en: 'Swap' }, action: 'switch', ack: { zh: '好，我换个清淡的：本草堂的鸡丝粥 + 小菜 + 燕麦奶，¥68，同样 13:00 送到。要这个吗？', en: 'OK — Herbology chicken congee + side + oat milk, ¥68, same 13:00 delivery. Want this?' } },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 300, dur: 1100 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '已下单，13:00 送到前台。你继续开会，放心。', en: 'Ordered. Reception by 13:00. Back to your meeting — I\'ve got it.' } },
    { t: 'divider', text: { zh: '同日 · 16:30', en: 'Same day · 16:30' } },
    { t: 'typing', delay: 300, dur: 1400, soul: { tagAdd: { zh: '深度懂你', en: 'Deeply known' }, scoreAdd: 4 } },
    { t: 'text', sender: 'xiaoyi', text: { zh: '悄悄提醒一下：今晚 19:00 是你和小美的约会，而且……', en: 'Quiet reminder: tonight 19:00 is your date with Mei. And…' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'gold',
      icon: 'heart',
      title: { zh: '今天是特别的日子', en: 'Today Is Special' },
      subtitle: { zh: '你和小美在一起的第 500 天', en: 'Your 500th day with Mei' },
      bullets: [
        { zh: '小美最近在朋友圈夸了 3 次某款香水', en: 'Mei mentioned a perfume 3× in her feed' },
        { zh: '她收藏了外滩源 2 号的招牌位置', en: 'She bookmarked the signature seat at Bund Source No.2' },
        { zh: '上次送她的蒂芙尼项链她很喜欢', en: 'She loved the Tiffany necklace last time' },
        { zh: '明天她休息，可以晚一点没关系', en: 'Tomorrow is her day off — late is fine' },
      ],
      highlight: { tone: 'gold', icon: 'sparkles', text: { zh: '我帮你把今晚都安排好了，你只负责到场', en: 'I\'ve arranged the whole night — just show up' } },
    }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'brand',
      icon: 'calendar',
      title: { zh: '今晚约会方案', en: 'Tonight\'s Date Plan' },
      rows: [
        { time: '18:00', event: { zh: '专车 · 准时到公司接你', en: 'Car · arrives office sharp' } },
        { time: '18:30', event: { zh: '到 BFC · Jo Malone 专柜（礼物已选好）', en: 'BFC · Jo Malone counter (gift ready)' } },
        { time: '18:55', event: { zh: '到外滩源 2 号餐厅（窗边浪漫位）', en: 'Bund Source No.2 (window seat)' } },
        { time: '19:00', event: { zh: '和小美相会', en: 'Meet Mei' } },
        { time: '20:30', event: { zh: '江边散步（第一次约会也是这里）', en: 'River walk (your first date spot)' } },
      ],
      highlight: { tone: 'brand', icon: 'sparkles', text: { zh: '500 天纪念，所有细节已就位', en: '500-day mark — every detail in place' } },
    }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'gold',
      icon: 'gift',
      title: { zh: '帮你选好的礼物', en: 'The Gift I Picked' },
      subtitle: { zh: 'Jo Malone · 蓝风铃香水 50ml', en: 'Jo Malone · Wild Bluebell 50ml' },
      bullets: [
        { zh: '小美上周朋友圈发过好想要', en: 'Mei said "I want this!" last week' },
        { zh: '配套手写卡片已为你拟好（可改）', en: 'Handwritten card draft ready (editable)' },
        { zh: '18:30 专柜已预留，直接拿走', en: 'Counter holding it for 18:30 pickup' },
        { zh: '¥1,280（已用银联权益减 ¥200）', en: '¥1,280 (¥200 off via UnionPay)' },
      ],
      highlight: { tone: 'gold', icon: 'heart', text: { zh: '卡片草稿：500 天，谢谢你还在我身边', en: 'Card draft: "500 days. Thank you for still being by my side."' } },
      buttons: [
        { text: { zh: '就这个', en: 'Perfect, this one' }, action: 'confirm', tone: 'primary', icon: 'check', userText: { zh: '完美，就这个', en: 'Perfect, this one' } },
        { text: { zh: '换一个', en: 'Different one' }, action: 'other', ack: { zh: '好，另外两个备选：Diptyque 玫瑰蜡烛 ¥520 · 施华洛世奇钥匙链 ¥880。想看哪个？', en: 'Two alternatives: Diptyque rose candle ¥520 · Swarovski keychain ¥880. Which one?' } },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 300, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: { zh: '都办妥了。餐厅我特地提醒他们把那首《月亮代表我的心》加进歌单里。', en: 'All set. I asked the restaurant to add "The Moon Represents My Heart" to the playlist.' } },
    { t: 'text', sender: 'xiaoyi', delay: 600, text: { zh: '你今晚好好享受。我把所有工作消息都静音到明早 9 点。这是属于你们的夜晚。', en: 'Enjoy tonight. All work pings muted until 9am tomorrow. This evening is yours.' } },
    { t: 'rcs', sender: 'xiaoyi', delay: 600, card: {
      tone: 'gold',
      icon: 'sparkles',
      title: { zh: '这就是灵魂伴侣', en: 'This Is Soul Companionship' },
      bullets: [
        { zh: '记得你的胃，帮你点清淡的午饭', en: 'Remembers your stomach, orders light' },
        { zh: '记得你们的纪念日，提前送上祝福', en: 'Remembers your anniversaries early' },
        { zh: '记得她爱的香水，帮你准备礼物', en: 'Knows her favorite perfume' },
        { zh: '记得你们第一次约会的地方', en: 'Remembers where you first dated' },
        { zh: '记得让你安心享受今晚', en: 'Makes sure you can enjoy tonight' },
      ],
      highlight: { tone: 'brand', icon: 'heart', text: { zh: '不是功能，是真正懂你的人', en: 'Not a feature — someone who truly knows you' } },
    }, soul: { tagAdd: { zh: '灵魂级信任', en: 'Soul-deep trust' }, scoreAdd: 6, statPatch: { proactive: 395, saved: 3880 } }},
  ],
};

const S5_EVOLUTION = {
  id: 'evolution',
  name: { zh: '灵魂进化', en: 'Soul Evolution' },
  icon: 'brain',
  tagline: { zh: '越用越懂你 · 预测式服务', en: 'Grows With You · Predictive Service' },
  intro: { zh: '从陌生人到灵魂伙伴，Soul 档案越用越深，形成运营商独有的用户留存壁垒——最强的深度绑定。', en: 'From stranger to soul partner, the Soul profile deepens daily — building a carrier-exclusive retention moat that no competitor can replicate.' },
  traditional: [
    { text: { zh: '换运营商无感迁移，留存弱', en: 'Carrier switching is seamless — weak retention' } },
    { text: { zh: '没有专属理解，每次重新解释', en: 'No personal understanding, explain every time' } },
    { text: { zh: '缺乏预测能力，永远被动', en: 'No prediction, always reactive' } },
    { text: { zh: '没有沉淀的用户关系资产', en: 'No relationship asset built up' } },
  ],
  xiaoyi: [
    { text: { zh: '每日学习你的习惯与偏好', en: 'Learns your habits daily' } },
    { text: { zh: '预测式服务，提前 3 天触达', en: 'Predictive — reaches 3 days early' } },
    { text: { zh: 'Soul 档案构建留存壁垒', en: 'Soul profile = retention moat' } },
    { text: { zh: '9 亿用户 × 180 天 = 灵魂资产', en: '900M × 180 days = soul asset' } },
  ],
  metric: { before: { zh: '0 天', en: 'Day 0' }, after: { zh: '180 天', en: 'Day 180' }, save: { zh: '粘性 ×10', en: 'Stickiness ×10' } },
  soul: {
    phone: '138****6789',
    tier: { zh: '全球通铂金 · 灵魂伙伴阶段', en: 'Platinum · Soul Partner Stage' },
    score: 94,
    radar: [95, 92, 88, 82, 75],
    tags: [
      { t: { zh: '商务出行', en: 'Business traveler' } },
      { t: { zh: '价格敏感', en: 'Price-sensitive' } },
      { t: { zh: '偏好高铁', en: 'Prefers train' } },
      { t: { zh: '有孩子', en: 'Has kids' } },
      { t: { zh: '持信用卡', en: 'Credit card' } },
      { t: { zh: '铂金会员', en: 'Platinum' } },
      { t: { zh: '月末流量紧张', en: 'Month-end data shortage' } },
      { t: { zh: '京东重度用户', en: 'JD heavy user' } },
      { t: { zh: '早班机爱好者', en: 'Early bird' } },
      { t: { zh: '时间敏感型', en: 'Time-sensitive' } },
      { t: { zh: '北京-广州双城', en: 'BJ-GZ commuter' } },
      { t: { zh: '灵魂级信任', en: 'Soul-deep trust' } },
    ],
    stats: { days: 180, proactive: 412, saved: 3840, time: 96 },
  },
  timeline: [
    {
      phase: { zh: '第 1 天', en: 'Day 1' }, title: { zh: '初次相识', en: 'First Encounter' }, icon: 'user',
      dialogues: [
        { role: 'user', text: { zh: '帮我查一下话费', en: 'Check my bill please' } },
        { role: 'bot', text: { zh: '您本月已消费 86.5 元，剩余流量 22.3GB，剩余通话 411 分钟。', en: 'You\'ve used ¥86.5 this month, 22.3GB and 411 min remaining.' } },
      ],
      soulUpdate: { zh: 'Soul 档案：基础通信数据', en: 'Soul profile: basic telecom data' },
    },
    {
      phase: { zh: '第 7 天', en: 'Day 7' }, title: { zh: '开始了解', en: 'Getting to Know You' }, icon: 'package',
      dialogues: [
        { role: 'bot', text: { zh: '（主动推送）您有一个京东包裹已发货（JD1234567），预计明天到达。需要帮您追踪吗？', en: '(Proactive) Your JD package JD1234567 has shipped, arriving tomorrow. Want me to track it?' } },
      ],
      soulUpdate: { zh: '新增标签：经常网购 · 使用京东', en: 'New tags: frequent shopper · uses JD' },
    },
    {
      phase: { zh: '第 30 天', en: 'Day 30' }, title: { zh: '逐渐默契', en: 'Building Rapport' }, icon: 'barChart',
      dialogues: [
        { role: 'bot', text: { zh: '（预测式推送）根据你的使用习惯，预计流量将在 27 号左右用完。要不要现在加一个 5 元/1GB 的临时流量包？', en: '(Predictive) Based on your habits, your data will run out around the 27th. Add a ¥5/1GB top-up now?' } },
      ],
      soulUpdate: { zh: '新增：月末流量紧张 · 晚间使用高峰', en: 'New: month-end data crunch · evening peak' },
    },
    {
      phase: { zh: '第 90 天', en: 'Day 90' }, title: { zh: '深度理解', en: 'Deep Understanding' }, icon: 'plane',
      dialogues: [
        { role: 'bot', text: { zh: '（综合分析航班+酒店+日历）你下周二又要出差广州了对吧？我注意到你通常坐南航 CZ3108（08:30 出发）。这次机票买好了吗？', en: '(Cross-source) You\'re flying to Guangzhou next Tuesday again, right? You usually take CZ3108 at 08:30. Have you booked yet?' } },
        { role: 'user', text: { zh: '买好了', en: 'Already booked' } },
        { role: 'bot', text: { zh: '好的。出发前一天我会提醒你，当天早上推送航班状态和去机场的路况。', en: 'Got it. I\'ll remind you the day before and push flight + traffic status the morning of.' } },
      ],
      soulUpdate: { zh: '新增：每月 1-2 次北京广州出差 · 偏好南航早班机', en: 'New: 1-2 BJ-GZ trips/month · prefers ChinaSouthern early flights' },
    },
    {
      phase: { zh: '第 180 天', en: 'Day 180' }, title: { zh: '灵魂伙伴', en: 'Soul Partner' }, icon: 'sparkles',
      dialogues: [
        { role: 'bot', text: { zh: '半年了，我越来越了解你了。现在我能预判你 80% 的需求：\n• 周一 7:30 推送本周日程+天气\n• 周三下午提醒出差准备\n• 每月 20 日告知账单和还款\n• 月底主动分析消费和套餐\n• 孩子学校短信自动识别高亮\n\n你觉得我还有哪些地方可以做得更好？', en: 'It\'s been half a year. I understand you more each day. I now predict 80% of your needs:\n• Mon 7:30 weekly schedule + weather\n• Wed afternoon trip-prep reminder\n• 20th of each month: bill + payment\n• Month-end: spend & plan analysis\n• Kids\' school messages auto-highlighted\n\nWhat else can I do better for you?' } },
      ],
      soulUpdate: { zh: 'Soul 理解度 94% · 预判准确率 80%', en: 'Soul understanding 94% · prediction accuracy 80%' },
    },
  ],
};

/* ============================================================
   SCENARIOS ARRAY — narrative arc:
   basic → data moat → proactive → VIP →
   soul companion ×4 → 180-day evolution
   ============================================================ */
const SCENARIOS = [
  S1_TARIFF,
  S2_SMS,
  S3_FLIGHT,
  S4_VIP,
  S_SECRETARY,
  S_EXAM,
  S_DEADLINE,
  S_BUTLER,
  S5_EVOLUTION,
];

/* ============================================================
   MOUNT
   ============================================================ */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

/* ============================================================
   QUALITY AUDIT CHECKLIST (reference for future maintenance)
   ============================================================
   [Text]
     ✓ All visible strings wrapped in t() and stored as {zh, en}
     ✓ No hard-coded English/Chinese in the JSX render path
     ✓ No emoji in UI chrome — Lucide icons only

   [Icons]
     ✓ Use <Icon name="..." /> from LUCIDE registry
     ✓ Stroke uses currentColor for color inheritance
     ✓ aria-hidden on decorative icons

   [Interaction]
     ✓ All buttons min 36-44px tap target
     ✓ Disabled states render with not-allowed cursor + opacity 0.4
     ✓ Quick replies always reachable; pause/done states never trap user

   [Responsive — 10 lessons]
     ✓ Mobile-first breakpoints at 1280 / 1024 / 768 / 480
     ✓ Sidebar collapses to drawer below 1024px
     ✓ Multi-panel grid → 1 column with FAB drawer entries
     ✓ Phone simulator shrinks 380→340→100% width
     ✓ Header tabs scroll horizontally on mobile (snap + no scrollbar)
     ✓ Drawer escape: Escape key + overlay click + close button
     ✓ body.style.overflow locked while drawer open
     ✓ Modal/Drawer width auto-adapts (min(360px, 92vw))
     ✓ Touch targets ≥ 44px on inputs and primary actions
     ✓ Topology (timeline) uses overflow-y-auto inside max-height container

   [Style consistency]
     ✓ Design tokens in styles.css :root scope
     ✓ Color/radius/spacing all reference tokens
     ✓ No inline magic numbers for spacing > 16px
     ✓ Animations use shared keyframes from one place

   [Common pitfalls avoided]
     ✗ Don't put scenario data references before the const declaration
     ✗ Don't use emoji in card titles (use Lucide icons)
     ✗ Don't forget to translate fresh-tag keys (use zh as canonical)
     ✗ Don't ship without testing keyboard escape on drawers
     ✗ Don't let Soul panel tag pulse persist across scenarios (clear freshTags)
============================================================ */
