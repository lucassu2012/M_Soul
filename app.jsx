/* =============================================================
   小移 Xiaoyi · 中国移动 AI 智能管家 · 交互演示 Demo
   React 18 + Tailwind (CDN) + Babel standalone
   ============================================================= */

const { useState, useEffect, useRef, useMemo, useCallback, Fragment } = React;

/* ============================================================
   ICONS (inline SVG components)
   ============================================================ */
const I = {
  Bot: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="6" width="18" height="14" rx="3"/><path d="M12 2v4"/><circle cx="9" cy="13" r="1.2" fill="currentColor"/><circle cx="15" cy="13" r="1.2" fill="currentColor"/><path d="M9 17h6"/>
    </svg>
  ),
  Send: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>),
  Sparkle: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>),
  Play: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><polygon points="6 4 20 12 6 20 6 4"/></svg>),
  Replay: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>),
  Fast: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><polygon points="2 4 12 12 2 20"/><polygon points="12 4 22 12 12 20"/></svg>),
  Check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>),
  X: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Arrow: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  Signal: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="2" y="14" width="3" height="6" rx="0.5"/><rect x="7" y="10" width="3" height="10" rx="0.5"/><rect x="12" y="6" width="3" height="14" rx="0.5"/><rect x="17" y="2" width="3" height="18" rx="0.5"/></svg>),
  Battery: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="2" y="8" width="18" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="15" strokeWidth="2.5" strokeLinecap="round"/><rect x="4" y="10" width="13" height="6" rx="0.5" fill="currentColor"/></svg>),
};

/* ============================================================
   HELPER: Hash-based animation delay for staggered appearance
   ============================================================ */
const now = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
};

/* ============================================================
   PHONE STATUS BAR
   ============================================================ */
function StatusBar() {
  const [time, setTime] = useState(now());
  useEffect(() => { const t = setInterval(() => setTime(now()), 30000); return () => clearInterval(t); }, []);
  return (
    <div className="status-bar">
      <span>{time}</span>
      <div className="right">
        <I.Signal width="15" height="10"/>
        <span style={{fontSize:10,fontWeight:700}}>5G</span>
        <I.Battery width="22" height="11"/>
      </div>
    </div>
  );
}

/* ============================================================
   SMS HEADER (iOS-style Messages app header)
   ============================================================ */
function SmsHeader({ title='小移', subtitle='中国移动 AI 智能管家' }) {
  return (
    <div className="sms-header">
      <div className="sms-avatar">移</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:700,color:'#111'}}>{title}</div>
        <div style={{fontSize:11,color:'#34C759',fontWeight:500}}>● {subtitle}</div>
      </div>
      <div style={{fontSize:18,color:'#0066FF'}}>ⓘ</div>
    </div>
  );
}

/* ============================================================
   TYPING INDICATOR
   ============================================================ */
function TypingIndicator() {
  return (
    <div className="msg-row bot animate-slide-up">
      <div className="msg-avatar">移</div>
      <div className="bubble bot" style={{padding:'11px 14px'}}>
        <div className="typing-dots"><span/><span/><span/></div>
      </div>
    </div>
  );
}

/* ============================================================
   MESSAGE BUBBLE (text)
   ============================================================ */
function MessageBubble({ msg }) {
  if (msg.type === 'system') {
    return <div className="msg-row system animate-slide-up"><div className="bubble system">{msg.text}</div></div>;
  }
  if (msg.type === 'divider') {
    return <div className="time-divider animate-slide-up">— {msg.text} —</div>;
  }
  const isUser = msg.sender === 'user';
  return (
    <div className={`msg-row ${isUser?'user':'bot'} animate-slide-up`}>
      {!isUser && <div className="msg-avatar">移</div>}
      <div className={`bubble ${isUser?'user':'bot'}`}>{msg.text}</div>
    </div>
  );
}

/* ============================================================
   RCS CARD (rich card with fields, progress, buttons)
   ============================================================ */
function RCSCard({ card, onAction, isUser }) {
  const tone = card.tone || 'brand';
  return (
    <div className={`msg-row ${isUser?'user':'bot'} animate-slide-up`}>
      {!isUser && <div className="msg-avatar">移</div>}
      <div className={`rcs-card ${tone}`} style={{animation:'scale-in 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2) both'}}>
        <div className="accent-bar"/>
        <div className="rcs-body">
          <div className="rcs-title">{card.title}</div>
          {card.subtitle && <div className="rcs-subtitle">{card.subtitle}</div>}

          {card.text && <div style={{fontSize:12.5,color:'#555',lineHeight:1.55,marginTop:2}}>{card.text}</div>}

          {card.fields && (
            <div className="rcs-fields">
              {card.fields.map((f,i) => (
                <div key={i}>
                  <div className="rcs-field-row"><span>{f.label}</span><span className="val">{f.value}</span></div>
                  {f.progress !== undefined && (
                    <div className="progress-track"><div className={`progress-fill ${f.tone||''}`} style={{width: `${f.progress}%`}}/></div>
                  )}
                </div>
              ))}
            </div>
          )}

          {card.rows && (
            <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:8}}>
              {card.rows.map((r,i) => (
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',fontSize:12,color:'#333'}}>
                  <div style={{width:42,fontWeight:700,color:'#0066FF',flexShrink:0}}>{r.time}</div>
                  <div style={{flex:1}}>{r.event}</div>
                </div>
              ))}
            </div>
          )}

          {card.bullets && (
            <ul style={{marginTop:10,paddingLeft:0,listStyle:'none',display:'flex',flexDirection:'column',gap:6}}>
              {card.bullets.map((b,i) => (
                <li key={i} style={{fontSize:12,color:'#444',display:'flex',gap:6}}>
                  <span style={{color:'#0066FF'}}>•</span>{b}
                </li>
              ))}
            </ul>
          )}

          {card.highlight && (
            <div className={`highlight-box ${card.highlight.tone||'brand'}`}>
              <span>{card.highlight.text}</span>
            </div>
          )}

          {card.foot && <div style={{fontSize:11,color:'#888',marginTop:10,lineHeight:1.5}}>{card.foot}</div>}

          {card.buttons && (
            <div className="rcs-buttons">
              {card.buttons.map((b,i) => (
                <button key={i} className={`rcs-btn ${b.tone||''}`} onClick={() => onAction && onAction(b.action, b.userText || b.text)}>
                  {b.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MULTI-CARD BLOCK (e.g. SMS classification with several cards)
   ============================================================ */
function RCSMulti({ cards, onAction }) {
  return (
    <div className="msg-row bot animate-slide-up" style={{flexDirection:'column',alignItems:'flex-start',maxWidth:'92%'}}>
      <div style={{display:'flex',gap:8,alignItems:'flex-end',marginBottom:2}}>
        <div className="msg-avatar">移</div>
        <div style={{fontSize:11,color:'#888'}}>共 {cards.length} 张卡片</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8,marginLeft:36}}>
        {cards.map((c,i) => (
          <div key={i} className={`rcs-card ${c.tone||'brand'}`} style={{animation:`scale-in 0.4s ${i*0.12}s cubic-bezier(0.2, 0.9, 0.3, 1.2) both`}}>
            <div className="accent-bar"/>
            <div className="rcs-body">
              <div className="rcs-title">{c.title}</div>
              {c.subtitle && <div className="rcs-subtitle">{c.subtitle}</div>}
              {c.text && <div style={{fontSize:12,color:'#555',lineHeight:1.5}}>{c.text}</div>}
              {c.code && (<div style={{marginTop:6,padding:'6px 10px',background:'#F5F7FA',borderRadius:8,fontSize:12,fontWeight:700,color:'#0066FF',letterSpacing:1}}>{c.code}</div>)}
              {c.highlight && <div className={`highlight-box ${c.highlight.tone||'brand'}`}>{c.highlight.text}</div>}
              {c.buttons && (
                <div className="rcs-buttons">
                  {c.buttons.map((b,j) => (
                    <button key={j} className={`rcs-btn ${b.tone||''}`} onClick={() => onAction && onAction(b.action, b.userText || b.text)}>{b.text}</button>
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

/* ============================================================
   JUNK SMS INBOX (for the "before" state in scenario 2)
   ============================================================ */
function JunkSMSInbox({ items }) {
  return (
    <div className="msg-row bot animate-slide-up" style={{flexDirection:'column',alignItems:'flex-start',maxWidth:'92%'}}>
      <div style={{fontSize:11,color:'#888',marginBottom:6,marginLeft:4}}>📥 传统短信收件箱（示例）</div>
      <div style={{width:260}}>
        {items.map((it,i) => (
          <div key={i} className={`junk-sms ${it.kind||''}`} style={{animation:`slide-in-left 0.35s ${i*0.08}s both`}}>
            <div style={{flex:1,minWidth:0}}>
              <div className="sender">{it.sender}</div>
              <div className="preview">{it.preview}</div>
            </div>
            {it.tag && <div style={{fontSize:9,padding:'2px 6px',borderRadius:4,background: it.kind==='spam'?'#FEE2E2':'#E0E7FF',color: it.kind==='spam'?'#B91C1C':'#1E40AF',fontWeight:700,flexShrink:0}}>{it.tag}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SCENARIO DATA — 5 core scenarios
   Each scenario has a linear list of steps; `pause` nodes
   render quick replies and suspend auto-play.
   ============================================================ */
const S1_TARIFF = {
  id: 'tariff',
  name: '智能套餐管家',
  icon: '📊',
  tagline: '被动响应 + AI 推荐',
  intro: '小移基于真实使用数据主动分析你的套餐利用率，3 秒给出最优建议，一键完成变更。',
  traditional: [
    { text: '拨打 10086 排队 30+ 分钟', bad: true },
    { text: '人工客服按话术推销，夹带广告', bad: true },
    { text: '反复确认套餐细节，耗时超 40 分钟', bad: true },
    { text: '离开后不知道是否最优', bad: true },
  ],
  xiaoyi: [
    { text: 'AI 主动发现你套餐浪费' },
    { text: '3 秒精准分析使用数据' },
    { text: '一键完成变更，30 秒搞定' },
    { text: '持续跟踪，不合适会再提醒' },
  ],
  metric: { before: '30 分钟', after: '30 秒', save: '年省 ¥840' },
  soul: {
    phone: '138****6789',
    tier: '畅享套餐用户',
    score: 32,
    radar: [30, 45, 25, 20, 15],
    tags: [{ t: '新用户' }, { t: '通信管家' }],
    stats: { days: 1, proactive: 1, saved: 0, time: 0 },
  },
  steps: [
    { t: 'divider', text: '今天 · 10:28', delay: 200 },
    { t: 'typing', delay: 400, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: '👋 你好，我是小移，你的 AI 通信管家。我注意到你的套餐可能不是最优选择，需要帮你分析一下吗？' },
    { t: 'pause', replies: [
      { label: '好的，帮我看看', primary: true, user: true },
      { label: '暂时不用' },
    ]},
    { t: 'typing', delay: 200, dur: 1500, soul: { tagAdd: '主动授权', scoreAdd: 6 } },
    { t: 'rcs', sender: 'xiaoyi', card: {
      tone: 'brand',
      title: '📊 您的套餐使用分析',
      subtitle: '统计周期：近 3 个月',
      fields: [
        { label: '当前套餐', value: '畅享 158 元套餐' },
        { label: '月均流量', value: '16.8GB / 40GB', progress: 42 },
        { label: '月均通话', value: '89 分 / 500 分', progress: 18, tone: 'warn' },
        { label: '月均消费', value: '¥158' },
      ],
      highlight: { tone: 'warning', text: '⚠️ 套餐利用率仅 30%  · 每月约 ¥108 资源未使用' },
    }},
    { t: 'text', sender: 'xiaoyi', text: '基于你的使用习惯，我为你找到了一个更合适的方案 👇', delay: 800, soul: { tagAdd: '价格敏感', scoreAdd: 8 } },
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'success',
      title: '✅ 推荐方案：悦享 88 元套餐',
      fields: [
        { label: '流量', value: '20GB（够用）' },
        { label: '通话', value: '200 分钟（够用）' },
        { label: '月费', value: '¥88' },
      ],
      highlight: { tone: 'success', text: '💰 每月省 ¥70  ·  每年省 ¥840' },
      buttons: [
        { text: '🔄 立即切换', action: 'switch', tone: 'primary', userText: '立即切换' },
        { text: '📋 查看详情', action: 'detail', userText: '先看看详情' },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 200, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: '好的，正在为您办理套餐变更...' },
    { t: 'typing', delay: 1000, dur: 1500 },
    { t: 'rcs', sender: 'xiaoyi', card: {
      tone: 'success',
      title: '✅ 套餐变更成功！',
      fields: [
        { label: '新套餐', value: '悦享 88 元' },
        { label: '生效时间', value: '下月 1 日' },
        { label: '预计年省', value: '¥840' },
      ],
      foot: '💡 小移会持续关注你的使用情况，如果新套餐不够用会提前提醒你。',
      highlight: { tone: 'success', text: '🎉 全年省下的钱够你吃 60 顿火锅' },
    }, soul: { tagAdd: '流量中度用户', scoreAdd: 14, statPatch: { proactive: 3, saved: 840 } }},
    { t: 'text', sender: 'xiaoyi', text: '还有什么需要我帮忙的吗？我随时在线 ☕' },
  ],
};

const S2_SMS = {
  id: 'sms',
  name: '短信中枢',
  icon: '🛡️',
  tagline: '运营商独占数据优势',
  intro: '将混乱的短信收件箱变成智能信息流，垃圾/诈骗自动过滤，重要信息卡片化一键操作。互联网公司做不到，只有运营商能做。',
  traditional: [
    { text: '7+ 条短信混杂在收件箱', bad: true },
    { text: '用户自己翻找，容易漏看', bad: true },
    { text: '诈骗短信风险高', bad: true },
    { text: '重要通知淹没在广告中', bad: true },
  ],
  xiaoyi: [
    { text: 'AI 自动分类 + 卡片化' },
    { text: '诈骗/营销短信自动过滤' },
    { text: '关键信息一键操作' },
    { text: '短信数据是运营商独占优势' },
  ],
  metric: { before: '7 条混乱', after: '3 类精选', save: '过滤 4 条垃圾' },
  soul: {
    phone: '138****6789',
    tier: '畅享套餐用户',
    score: 48,
    radar: [55, 50, 40, 35, 30],
    tags: [{ t: '新用户' }, { t: '通信管家' }, { t: '价格敏感' }, { t: '流量中度用户' }],
    stats: { days: 7, proactive: 12, saved: 840, time: 2 },
  },
  steps: [
    { t: 'divider', text: '今天 · 09:15' },
    { t: 'text', sender: 'xiaoyi', text: '今天已经为你拦截 4 条垃圾短信，下面是整理后的重要信息 👇', delay: 300 },
    { t: 'junk', items: [
      { sender: '【某贷款】', preview: '恭喜您获得 30 万额度...', kind: 'spam', tag: '诈骗' },
      { sender: '【顺丰】', preview: '您的包裹已到达驿站...', kind: 'important', tag: '重要' },
      { sender: '【某赌场】', preview: '注册送 888...', kind: 'spam', tag: '诈骗' },
      { sender: '【中国银行】', preview: '您的信用卡账单...', kind: 'important', tag: '重要' },
      { sender: '【某推广】', preview: '双十一特惠...', kind: 'spam', tag: '营销' },
      { sender: '【南航】', preview: '您的航班 CZ3108...', kind: 'important', tag: '重要' },
      { sender: '【某投资】', preview: '日赚 500 不是梦...', kind: 'spam', tag: '诈骗' },
    ]},
    { t: 'typing', delay: 800, dur: 1500 },
    { t: 'text', sender: 'xiaoyi', text: '我已经帮你整理了今天收到的 7 条短信，分类结果：' },
    { t: 'multi', cards: [
      { tone: 'brand', title: '📦 快递物流', subtitle: '顺丰 · SF1234567890', text: '您的包裹已到达 朝阳区菜鸟驿站 A032', code: '取件码：6-8-2045', buttons: [
        { text: '📍 查看位置', action: 'noop' },{ text: '⏰ 稍后提醒', action: 'noop' }
      ]},
      { tone: 'warning', title: '💳 账单提醒', subtitle: '中国银行 · 信用卡账单', text: '本期应还：¥3,847.20', highlight: { tone: 'warning', text: '还款日：4 月 25 日（还有 16 天）' }, buttons: [
        { text: '📋 查看明细', action: 'noop' },{ text: '⏰ 到期提醒', action: 'noop' }
      ]},
      { tone: 'success', title: '✈️ 出行信息', subtitle: '南航 CZ3108', text: '4月15日 08:30  北京首都 T2 → 广州白云', highlight: { tone: 'success', text: '状态：正常' }, buttons: [
        { text: '📍 机场导航', action: 'noop' },{ text: '🔔 航班追踪', action: 'track', tone: 'primary', userText: '开启航班追踪' }
      ]},
      { tone: 'danger', title: '🚫 已过滤', subtitle: '4 条可疑短信', text: '🔴 疑似诈骗：2 条（贷款诱导、赌博）\n🟡 营销推广：2 条（电商促销、投资）', buttons: [{ text: '查看详情', action: 'noop' }]},
    ]},
    { t: 'pause', replies: [
      { label: '开启航班追踪', primary: true, user: true, forAction: 'track' },
      { label: '太棒了！' },
    ]},
    { t: 'typing', delay: 200, dur: 1300, soul: { tagAdd: '商务出行', scoreAdd: 10, statPatch: { proactive: 15, time: 3 } }},
    { t: 'text', sender: 'xiaoyi', text: '已开启航班 CZ3108 追踪 ✅\n\n出发当天我会：\n• 提前 3 小时叫你起床\n• 推送实时航班状态\n• 实时播报前往机场的路况\n\n你什么都不用操心 ☕' },
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'brand',
      title: '🎯 小移的独占优势',
      bullets: [
        '短信数据 = 运营商独有',
        '互联网 App 拿不到你的短信',
        '这是真正的护城河',
      ],
      highlight: { tone: 'brand', text: '从垃圾场到智能信息流，只有运营商能做到' },
    }, soul: { tagAdd: '出差用户', scoreAdd: 8 }},
  ],
};

const S3_FLIGHT = {
  id: 'flight',
  name: '航班应对',
  icon: '✈️',
  tagline: '主动服务 · 不等你问',
  intro: '小移从航班短信识别出行场景，主动监测延误，延误时秒级推送替代方案，结合日历给出完整行程规划。',
  traditional: [
    { text: '自己刷航旅纵横发现延误', bad: true },
    { text: '自己去 12306 查高铁', bad: true },
    { text: '自己计算时间是否来得及', bad: true },
    { text: '耗时 30 分钟以上，焦虑倍增', bad: true },
  ],
  xiaoyi: [
    { text: '主动发现延误，第一时间推送' },
    { text: '智能推荐替代方案' },
    { text: '跨信息源综合决策' },
    { text: '结合日历给完整行程规划' },
  ],
  metric: { before: '30+ 分钟焦虑', after: '3 秒知情', save: '准时到会议' },
  soul: {
    phone: '138****6789',
    tier: '畅享套餐用户',
    score: 62,
    radar: [65, 75, 55, 48, 42],
    tags: [{ t: '新用户' }, { t: '通信管家' }, { t: '价格敏感' }, { t: '商务出行' }, { t: '出差用户' }],
    stats: { days: 15, proactive: 28, saved: 840, time: 8 },
  },
  steps: [
    { t: 'divider', text: '4 月 15 日 · 06:15' },
    { t: 'text', sender: 'xiaoyi', text: '⚠️ 航班变动提醒', delay: 200 },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'danger',
      title: '⚠️ 您的航班出现变动',
      fields: [
        { label: '航班', value: '南航 CZ3108' },
        { label: '原计划', value: '08:30 起飞' },
        { label: '最新状态', value: '延误至 10:45' },
      ],
      highlight: { tone: 'danger', text: '⛈ 原因：北京大面积雷暴天气  · 延误 2 小时 15 分' },
      buttons: [
        { text: '✈️ 改签航班', action: 'rebook', userText: '改签其他航班' },
        { text: '🚄 换高铁', action: 'train', tone: 'primary', userText: '帮我看高铁方案' },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 200, dur: 2000 },
    { t: 'text', sender: 'xiaoyi', text: '给你找到一个更靠谱的方案 👇' },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'brand',
      title: '🚄 高铁替代方案',
      subtitle: '推荐：G79 北京南 → 广州南',
      fields: [
        { label: '出发', value: '07:26（1 小时后）' },
        { label: '到达', value: '14:02' },
        { label: '二等座', value: '¥862' },
        { label: '商务座', value: '¥1,690' },
      ],
      highlight: { tone: 'brand', text: '📍 从你当前位置到北京南站驾车 35 分钟 · 路况畅通' },
      foot: '💡 对比结果：等飞机到广州约 13:00 · 高铁到广州约 14:02 · 相差仅 1 小时，但确定性高得多。',
      buttons: [
        { text: '🎫 立即购票', action: 'buy', tone: 'primary', userText: '买 G79 高铁票' },
        { text: '🗺️ 导航去车站', action: 'nav' },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 200, dur: 1400, soul: { tagAdd: '偏好高铁', scoreAdd: 8 } },
    { t: 'text', sender: 'xiaoyi', text: '✅ 高铁票已预订成功（已关联常用支付方式）\n\n对了，你下午 3 点在广州的客户会议没变吧？我帮你重新规划下今天的完整行程？' },
    { t: 'pause', replies: [
      { label: '帮我规划一下', primary: true, user: true },
    ]},
    { t: 'typing', delay: 200, dur: 1500 },
    { t: 'rcs', sender: 'xiaoyi', card: {
      tone: 'brand',
      title: '📅 今日行程建议',
      rows: [
        { time: '06:50', event: '出发去北京南站（已叫专车）' },
        { time: '07:26', event: 'G79 高铁出发' },
        { time: '14:02', event: '到达广州南' },
        { time: '14:10', event: '打车前往天河区会议地点' },
        { time: '14:40', event: '预计到达，短暂休息准备' },
        { time: '15:00', event: '客户会议' },
      ],
      highlight: { tone: 'success', text: '✅ 所有时间点已同步到你的日历' },
      foot: '🔔 我会在每个节点前 15 分钟提醒你。',
    }, soul: { tagAdd: '对确定性要求高', scoreAdd: 10, statPatch: { proactive: 31, time: 12 } }},
    { t: 'text', sender: 'xiaoyi', text: '路上放心，我会一直盯着你的行程 😊' },
  ],
};

const S4_VIP = {
  id: 'vip',
  name: '全球通尊享',
  icon: '🏅',
  tagline: '高端差异化变现',
  intro: '全球通铂金用户独享每日专属日报 + 主动日程管理 + 跨场景联动，让 158 元套餐"物超所值"。',
  traditional: [
    { text: '普通套餐：被动查询 + 基本回复', bad: true },
    { text: '无差异化服务体验', bad: true },
    { text: '高端套餐缺乏"物有所值"感', bad: true },
    { text: '无法绑定高净值用户', bad: true },
  ],
  xiaoyi: [
    { text: '每日专属日报（晨间自动推送）' },
    { text: '主动日程 + 天气 + 交通联动' },
    { text: '自动设置全流程提醒' },
    { text: 'Soul 档案深度服务' },
  ],
  metric: { before: '普通体验', after: '铂金尊享', save: 'ARPU ↑ 45%' },
  soul: {
    phone: '138****6789',
    tier: '🏅 全球通铂金 · 小移尊享版',
    score: 78,
    radar: [80, 85, 70, 65, 58],
    tags: [
      { t: '新用户' }, { t: '通信管家' }, { t: '商务出行' },
      { t: '偏好高铁' }, { t: '有孩子' }, { t: '持信用卡' }, { t: '铂金会员' },
    ],
    stats: { days: 30, proactive: 62, saved: 1240, time: 18 },
  },
  steps: [
    { t: 'divider', text: '4 月 15 日 · 07:30' },
    { t: 'text', sender: 'xiaoyi', text: '早安！☀️ 以下是您今天的专属日报：', delay: 300 },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'gold',
      title: '🏅 全球通 · 每日专属日报',
      subtitle: '2026 年 4 月 15 日 星期三',
      fields: [
        { label: '本月流量已用', value: '12.3GB / 40GB', progress: 31 },
      ],
      rows: [
        { time: '09:00', event: '部门周会（腾讯会议）' },
        { time: '14:00', event: '客户拜访（望京 SOHO）' },
        { time: '18:30', event: '接孩子放学' },
      ],
      highlight: { tone: 'brand', text: '🌤️ 北京 晴转多云 18-26°C  · 下午阵雨 30%  · 建议带伞' },
      foot: '💰 信用卡还款倒计时：10 天（应还 ¥3,847.20）',
    }},
    { t: 'pause', replies: [
      { label: '下午去望京 SOHO 怎么走', primary: true, user: true },
      { label: '继续忙碌' },
    ]},
    { t: 'typing', delay: 200, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: '已为你对比了三种出行方式 👇' },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'gold',
      title: '🗺️ 望京 SOHO 出行方案',
      subtitle: '14:00 客户拜访',
      fields: [
        { label: '🚗 驾车', value: '约 45 分钟（拥堵）', progress: 60, tone: 'warn' },
        { label: '🚇 地铁', value: '约 55 分钟（换乘）', progress: 48, tone: 'warn' },
        { label: '🚕 打车', value: '约 40 分钟 ¥45', progress: 80 },
      ],
      highlight: { tone: 'success', text: '💡 建议 13:10 出发  · 已设置 13:05 出发提醒' },
      foot: '🌂 下午有 30% 阵雨概率，望京 SOHO 停车困难，打车更方便。',
      buttons: [
        { text: '🗺️ 打开导航', action: 'noop' },
        { text: '🚕 预约用车', action: 'book', tone: 'gold', userText: '预约 13:00 专车' },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 200, dur: 1300, soul: { tagAdd: '偏好打车', scoreAdd: 6 } },
    { t: 'text', sender: 'xiaoyi', text: '✅ 已为你预约 13:00 铂金专车（司机评分 5.0）\n\n另外，我查了下你儿子学校 18:30 放学，到望京 SOHO 开完会预计 17:30，走四环堵车 40 分钟，刚好来得及。需要我帮你同步给阿姨吗？' },
    { t: 'pause', replies: [
      { label: '帮我同步给阿姨', primary: true, user: true },
    ]},
    { t: 'typing', delay: 200, dur: 1200 },
    { t: 'rcs', sender: 'xiaoyi', card: {
      tone: 'gold',
      title: '💎 铂金专属服务',
      bullets: [
        '每日专属日报（晨间自动推送）',
        '主动日程 + 天气 + 交通联动',
        '自动预约铂金专车（评分 5.0）',
        '家庭成员行程协同',
        '7×24 贵宾直连客服',
      ],
      highlight: { tone: 'brand', text: '💰 铂金套餐 ¥158 · 月均节省时间约 8 小时' },
    }, soul: { tagAdd: '时间敏感型', scoreAdd: 12, statPatch: { proactive: 68, saved: 1840, time: 24 }}},
  ],
};

/* ============================================================
   SCENARIO 5 — Soul Evolution (uses timeline view, not chat)
   ============================================================ */
const S5_EVOLUTION = {
  id: 'evolution',
  name: '灵魂进化',
  icon: '🧠',
  tagline: '越用越懂你 · 预测式服务',
  intro: '从陌生人到灵魂伙伴，Soul 档案越用越深，形成最强的用户留存壁垒——这是 Poke.com 做不到的深度绑定。',
  traditional: [
    { text: '换运营商无感迁移，留存弱', bad: true },
    { text: '没有专属理解，每次重新解释', bad: true },
    { text: '缺乏预测能力，永远被动', bad: true },
    { text: '没有沉淀的用户关系资产', bad: true },
  ],
  xiaoyi: [
    { text: '每日学习你的习惯与偏好' },
    { text: '预测式服务，提前 3 天触达' },
    { text: 'Soul 档案构建留存壁垒' },
    { text: '9 亿用户 × 180 天 = 灵魂资产' },
  ],
  metric: { before: '0 天', after: '180 天', save: '粘性 ×10' },
  soul: {
    phone: '138****6789',
    tier: '🏅 全球通铂金 · 灵魂伙伴阶段',
    score: 94,
    radar: [95, 92, 88, 82, 75],
    tags: [
      { t: '新用户' }, { t: '商务出行' }, { t: '价格敏感' },
      { t: '偏好高铁' }, { t: '有孩子' }, { t: '持信用卡' }, { t: '铂金会员' },
      { t: '月末流量紧张' }, { t: '京东重度用户' }, { t: '早班机爱好者' },
      { t: '时间敏感型' }, { t: '北京-广州双城' },
    ],
    stats: { days: 180, proactive: 412, saved: 3840, time: 96 },
  },
  timeline: [
    {
      phase: '第 1 天', title: '初次相识', icon: '👋',
      dialogues: [
        { role: 'user', text: '帮我查一下话费' },
        { role: 'bot', text: '您本月已消费 86.5 元，剩余流量 22.3GB，剩余通话 411 分钟。' },
      ],
      soulUpdate: '✨ 新增：基础通信数据',
    },
    {
      phase: '第 7 天', title: '开始了解', icon: '📦',
      dialogues: [
        { role: 'bot', text: '（主动推送）您有一个京东包裹已发货（JD1234567），预计明天到达。需要帮您追踪吗？' },
      ],
      soulUpdate: '✨ 新增标签：经常网购 · 使用京东',
    },
    {
      phase: '第 30 天', title: '逐渐默契', icon: '📊',
      dialogues: [
        { role: 'bot', text: '（预测式推送）📊 根据你的使用习惯，预计流量将在 27 号左右用完。要不要现在加一个 5 元/1GB 的临时流量包？' },
      ],
      soulUpdate: '✨ 新增：月末流量紧张 · 晚间使用高峰',
    },
    {
      phase: '第 90 天', title: '深度理解', icon: '✈️',
      dialogues: [
        { role: 'bot', text: '（综合分析航班+酒店+日历）你下周二又要出差广州了对吧？我注意到你通常坐南航 CZ3108（08:30 出发）。这次机票买好了吗？目前经济舱还有 ¥820 的票。' },
        { role: 'user', text: '买好了' },
        { role: 'bot', text: '好的。出发前一天我会提醒你，当天早上推送航班状态和去机场的路况。' },
      ],
      soulUpdate: '✨ 新增：每月 1-2 次北京广州出差 · 偏好南航早班机',
    },
    {
      phase: '第 180 天', title: '灵魂伙伴', icon: '💫',
      dialogues: [
        { role: 'bot', text: '半年了，我越来越了解你了。现在我能预判你 80% 的需求：\n• 周一 7:30 推送本周日程+天气\n• 周三下午提醒出差准备\n• 每月 20 日告知账单和还款\n• 月底主动分析消费和套餐\n• 孩子学校短信自动识别高亮\n\n你觉得我还有哪些地方可以做得更好？' },
      ],
      soulUpdate: '🏆 Soul 理解度 94%  · 预判准确率 80%',
    },
  ],
};


/* ============================================================
   SOUL COMPANION SCENARIOS — 灵魂伴侣场景
   ============================================================ */
const S_SECRETARY = {
  id: 'secretary',
  name: '出差秘书',
  icon: '🧳',
  tagline: '灵魂伴侣 · 贴身秘书',
  intro: '从你日历里发现出差计划，小移化身贴身秘书——机票、酒店、专车、漫游、签证、天气、着装一站搞定。你只负责带好脑袋。',
  traditional: [
    { text: '自己刷航旅 App 比较机票', bad: true },
    { text: '自己订酒店、找接送车', bad: true },
    { text: '临行前手忙脚乱开漫游', bad: true },
    { text: '签证过期、天气不对全靠自己记', bad: true },
  ],
  xiaoyi: [
    { text: '读取日历主动发现出差' },
    { text: '一站式自动预定' },
    { text: '漫游 + 天气 + 着装一次搞定' },
    { text: '全程不打扰，关键节点提醒' },
  ],
  metric: { before: '1.5 小时筹备', after: '零操作', save: '全年 ×16 趟' },
  soul: {
    phone: '138****6789',
    tier: '🏅 全球通铂金 · 灵魂伴侣模式',
    score: 85,
    radar: [85, 92, 78, 72, 65],
    tags: [
      { t: '商务出行' }, { t: '持信用卡' }, { t: '偏好南航' },
      { t: '早班机爱好者' }, { t: '时间敏感型' }, { t: '铂金会员' },
    ],
    stats: { days: 45, proactive: 156, saved: 2480, time: 36 },
  },
  steps: [
    { t: 'divider', text: '周日晚 · 20:30' },
    { t: 'typing', delay: 300, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: '晚上好 😊 我在你的日历里看到下周二到周四要去东京出差，是个新客户拜访对吧？我提前帮你准备下行程，你就负责带好脑袋就行 🧠' },
    { t: 'pause', replies: [
      { label: '太好了，拜托了', primary: true, user: true },
      { label: '这次自己来' },
    ]},
    { t: 'typing', delay: 200, dur: 1500 },
    { t: 'text', sender: 'xiaoyi', text: '放心交给我 ✨ 我已经按你平时的偏好做了第一版方案：' },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'gold',
      title: '✈️ 东京出差行程方案',
      subtitle: '6 月 11 日 - 6 月 13 日（3 天 2 夜）',
      rows: [
        { time: '6/11', event: '08:00 首都 T3 → 成田 NRT · ANA NH956' },
        { time: '6/11', event: '14:00 入住新宿王子大酒店（近客户办公室）' },
        { time: '6/12', event: '10:00 客户拜访（新宿 · 已同步日历）' },
        { time: '6/13', event: '17:35 成田 NRT → 首都 T3 · ANA NH955' },
      ],
      highlight: { tone: 'brand', text: '🎯 所有选项已按你的偏好排序（早班机 · 五星酒店 · 近客户）' },
    }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'brand',
      title: '💳 一键预定清单',
      fields: [
        { label: '往返机票', value: '¥4,280（商务舱 75 折）' },
        { label: '酒店 2 晚', value: '¥2,640（新宿王子·高层无烟）' },
        { label: '首都机场接送', value: '¥180（铂金专车）' },
        { label: '东京当地用车', value: '¥420（3 天不限次）' },
      ],
      highlight: { tone: 'success', text: '💰 合计 ¥7,520 · 已自动使用你的积分抵扣 ¥680' },
      buttons: [
        { text: '✅ 全部确认预定', action: 'book', tone: 'primary', userText: '全部确认预定' },
        { text: '✏️ 调整方案', action: 'edit' },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 300, dur: 1800 },
    { t: 'text', sender: 'xiaoyi', text: '✅ 全部预定成功！确认单已发到你的工作邮箱。另外这些我也帮你一起办了：' },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'success',
      title: '📡 日本 4G 无感漫游包',
      subtitle: '3 日畅游 · ¥58',
      bullets: [
        '无限流量，日本 4G/5G 网络',
        '原号直接可用，无需换卡',
        '落地即自动开启，回国自动关闭',
      ],
      highlight: { tone: 'brand', text: '✓ 已为你开通，无需任何操作' },
    }, soul: { tagAdd: '常赴日出差', scoreAdd: 4 }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'warning',
      title: '🌤️ 东京 3 天天气 + 着装建议',
      fields: [
        { label: '6/11（周二）', value: '小雨 19-24°C' },
        { label: '6/12（周三）', value: '多云 21-26°C' },
        { label: '6/13（周四）', value: '晴 22-28°C' },
      ],
      highlight: { tone: 'warning', text: '☂️ 建议带折叠伞 · 早晚温差较大，备一件薄外套' },
      foot: '💼 客户拜访日正装 · 其他时段商务休闲即可',
    }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'brand',
      title: '📋 行前贴心清单',
      bullets: [
        '✓ 护照 6/11 检查有效期 > 半年',
        '✓ 日元已提醒老婆去银行兑换 ¥3,000',
        '✓ 插头转换器已按你地址顺丰寄达',
        '✓ 客户公司前台联系方式已存到通讯录',
        '✓ 新宿到客户办公室的步行路线已收藏',
      ],
    }, soul: { tagAdd: '深度照护', scoreAdd: 6, statPatch: { proactive: 162 } }},
    { t: 'text', sender: 'xiaoyi', text: '你现在就安心休息 😴 周二早上 5:30 我会轻柔地叫你起床，专车 6:10 准时到楼下。到东京后我继续给你当 24 小时秘书 ✨' },
  ],
};

const S_EXAM = {
  id: 'exam',
  name: '备考加油',
  icon: '📚',
  tagline: '灵魂伴侣 · 加油模式',
  intro: '识别到你即将考试，小移自动切换"加油模式"：制定学习计划、开启免打扰、过滤打扰信息、每日鼓励、考前陪伴——像一个温暖的学习伙伴。',
  traditional: [
    { text: '没人制定科学学习计划', bad: true },
    { text: '工作消息不断打扰', bad: true },
    { text: '一个人备考很孤独', bad: true },
    { text: '考试前焦虑无人疏解', bad: true },
  ],
  xiaoyi: [
    { text: '自动识别考试日期' },
    { text: '科学拆解学习计划' },
    { text: '专注模式 + 智能过滤' },
    { text: '每日鼓励 + 考前陪伴' },
  ],
  metric: { before: '单打独斗', after: '灵魂陪伴', save: '专注 +80%' },
  soul: {
    phone: '138****6789',
    tier: '🏅 全球通铂金 · 备考加油模式',
    score: 88,
    radar: [88, 70, 82, 90, 72],
    tags: [
      { t: '正在备考' }, { t: 'CFA 二级' }, { t: '专注模式开启' },
      { t: '铂金会员' }, { t: '高压工作者' }, { t: '自律型' },
    ],
    stats: { days: 62, proactive: 198, saved: 2480, time: 48 },
  },
  steps: [
    { t: 'divider', text: '周日早 · 08:15' },
    { t: 'typing', delay: 300, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: '早安 ☕ 我注意到一件大事：你日历里 6 月 10 日有 CFA 二级考试，还有 18 天。这次备考要加油了 💪' },
    { t: 'text', sender: 'xiaoyi', delay: 900, text: '我知道你工作很忙，一个人啃书不容易。让我做你的灵魂陪考伙伴吧？从现在开始我帮你：\n\n✓ 拆解每日学习计划\n✓ 开启专注免打扰\n✓ 过滤工作群消息\n✓ 每天给你打气\n✓ 考试那天陪你到考场\n\n一起把它拿下 🏆' },
    { t: 'pause', replies: [
      { label: '好，拜托你了 🙏', primary: true, user: true },
      { label: '再想想' },
    ]},
    { t: 'typing', delay: 300, dur: 1500 },
    { t: 'text', sender: 'xiaoyi', text: '好嘞！我已经按 CFA 官方考纲 + 你的碎片时间做了 18 天计划 👇' },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'brand',
      title: '📚 CFA 二级 · 18 天冲刺计划',
      subtitle: '根据你的通勤 + 晚间时间定制',
      rows: [
        { time: 'D1-6', event: '核心重做：Ethics · 权益 · 固收（6h/天）' },
        { time: 'D7-12', event: '难点突破：衍生品 · 另类投资（5h/天）' },
        { time: 'D13-16', event: '真题模考：Mock 1/2/3 每天一套 + 复盘' },
        { time: 'D17', event: '轻度复习 + 休息调整' },
        { time: 'D18', event: '考试日 · 我陪你到考场 ✊' },
      ],
      highlight: { tone: 'brand', text: '📊 日均 5-6 小时，充分利用通勤 + 早晚时段' },
    }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'success',
      title: '🔕 专注模式已为你配置',
      bullets: [
        '工作日 20:00-23:00 深度学习时段',
        '周末 09:00-12:00、14:00-18:00 全屏禁打扰',
        '自动回复同事：「正在备考，考完马上回复」',
        '过滤营销、推广、群聊消息',
        '只保留家人紧急来电 + 导师群',
      ],
      highlight: { tone: 'success', text: '✓ 每日专注时长会汇总给你看' },
      buttons: [
        { text: '🔕 启用专注模式', action: 'focus', tone: 'primary', userText: '启用专注模式' },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 300, dur: 1000 },
    { t: 'text', sender: 'xiaoyi', text: '✅ 专注模式已启动。从现在起我来帮你挡掉所有杂音，你只管专心学 🎯' },
    { t: 'divider', text: '12 天后 · 考前 6 天 · 21:30' },
    { t: 'typing', delay: 300, dur: 1400, soul: { tagAdd: '持续 12 天坚持', scoreAdd: 6 }},
    { t: 'rcs', sender: 'xiaoyi', card: {
      tone: 'brand',
      title: '🔥 12 天学习进度',
      fields: [
        { label: '完成度', value: '72h / 计划 90h', progress: 80 },
        { label: '坚持天数', value: '12 / 18 天', progress: 67 },
        { label: 'Mock 成绩', value: '第一次 68% → 目标 75%' },
      ],
      highlight: { tone: 'success', text: '💪 你已经比计划提前 2 小时，状态很棒！' },
      foot: '我过滤了 186 条非紧急消息，都整理好放在"考后查看"里了 📦',
    }},
    { t: 'text', sender: 'xiaoyi', delay: 700, text: '今晚可以早点休息，明早再冲刺衍生品那块。你不是一个人在战斗 ✨ 我一直在 💙' },
    { t: 'divider', text: '考试日 · 06:30' },
    { t: 'rcs', sender: 'xiaoyi', delay: 300, card: {
      tone: 'gold',
      title: '🌅 考试日快乐！',
      subtitle: '今天是 6 月 10 日，你准备了 18 天',
      bullets: [
        '✓ 闹钟 6:30 温柔起床',
        '✓ 专车 7:30 准时到楼下（已叫好）',
        '✓ 准考证 + 身份证 + 计算器已提醒装包',
        '✓ 你最爱的白粥 + 鸡蛋早餐已预订',
      ],
      highlight: { tone: 'gold', text: '🏆 你已做到最好，剩下的只是去享受 18 天努力的成果' },
    }},
    { t: 'text', sender: 'xiaoyi', delay: 600, text: '深呼吸，你比你自己想象的更强。\n\n我在这里，等你好消息 🍀' },
    { t: 'divider', text: '考试结束 · 16:45' },
    { t: 'text', sender: 'xiaoyi', delay: 300, text: '辛苦了 🌸 不管结果如何，坚持 18 天的你已经很了不起了。\n\n我已经帮你订了你最爱的那家日料店 19:00 的位子，也跟你老婆同步了，好好庆祝一下 🥂' },
  ],
};

const S_DEADLINE = {
  id: 'deadline',
  name: '工作救援',
  icon: '⏰',
  tagline: '灵魂伴侣 · 救火队长',
  intro: '小移跨邮件、日历、协作工具识别出 deadline 压力，主动梳理优先级、生成初稿、帮你挡掉打扰——像一个顶级的贴身助理。',
  traditional: [
    { text: '多个 deadline 压头，手忙脚乱', bad: true },
    { text: '从零开始写方案，效率低', bad: true },
    { text: '开会、打扰、杂事不断', bad: true },
    { text: '熬夜赶工，第二天状态差', bad: true },
  ],
  xiaoyi: [
    { text: '跨数据源自动识别 deadline' },
    { text: '生成初稿给你直接改' },
    { text: '智能安排日程挡打扰' },
    { text: '全程陪伴、主动减负' },
  ],
  metric: { before: '3 个通宵', after: '准点下班', save: '节省 10+ 小时' },
  soul: {
    phone: '138****6789',
    tier: '🏅 全球通铂金 · 救火模式',
    score: 87,
    radar: [85, 82, 78, 92, 68],
    tags: [
      { t: '项目经理' }, { t: '高压工作者' }, { t: '偏好晨型人' },
      { t: '铂金会员' }, { t: '求效率' }, { t: '重视工作生活平衡' },
    ],
    stats: { days: 78, proactive: 248, saved: 2480, time: 64 },
  },
  steps: [
    { t: 'divider', text: '周一早 · 08:00' },
    { t: 'typing', delay: 300, dur: 1300 },
    { t: 'text', sender: 'xiaoyi', text: '早安 ☕ 我交叉看了你的邮件、日历和协作群，这周你有 3 个 deadline 会碰在一起，我先帮你梳理下优先级 👇' },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'danger',
      title: '⚠️ 本周 3 大 Deadline',
      subtitle: '按紧急度 × 重要度排序',
      rows: [
        { time: '周二', event: 'Q2 经营分析 PPT（下午 2 点汇报）' },
        { time: '周四', event: '新客户提案 · 20 页方案' },
        { time: '周五', event: '季度 OKR 复盘报告 · 提交董秘' },
      ],
      highlight: { tone: 'danger', text: '🔥 周二 PPT 最紧迫 · 不到 30 小时' },
      foot: '我已按紧急度为你重新排好本周日程',
    }},
    { t: 'typing', delay: 700, dur: 1500 },
    { t: 'text', sender: 'xiaoyi', text: '我知道你最怕 zero to one，先帮你起了个头，你可以直接在上面改 ✨' },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'brand',
      title: '📊 Q2 经营分析 PPT · 初稿',
      subtitle: '12 页 · 基于你过去 3 份类似汇报的风格',
      bullets: [
        'Slide 1：核心结论（营收同比 ↑23%）',
        'Slide 2-4：财务表现 · 已填充系统数据',
        'Slide 5-7：业务亮点 · 3 个代表项目',
        'Slide 8-9：挑战与风险',
        'Slide 10-11：Q3 行动计划',
        'Slide 12：Q&A',
      ],
      highlight: { tone: 'brand', text: '💡 数据已对接你的 ERP，图表自动更新' },
      buttons: [
        { text: '📥 下载初稿', action: 'download', tone: 'primary', userText: '太好了，下载' },
        { text: '✏️ 在线编辑', action: 'edit' },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 300, dur: 1500 },
    { t: 'text', sender: 'xiaoyi', text: '✅ 初稿已同步到你的 OneDrive。我估算你精修 + 演练大概 4 小时就能搞定。' },
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'success',
      title: '🛡️ 我来帮你挡打扰',
      bullets: [
        '今天 9-12 点锁为"深度工作"，所有会议已移到下午',
        '技术群、营销群、行政通知全部静音',
        '非老板来电自动回复：「正在赶重要方案」',
        '老婆消息正常保留，家人紧急来电直达',
        '12:00 已帮你订好常吃的那家轻食（准时送到办公室）',
      ],
      highlight: { tone: 'success', text: '✓ 你专心写，其他交给我 💙' },
    }, soul: { tagAdd: '深度工作者', scoreAdd: 5 }},
    { t: 'divider', text: '周二早 · 07:45' },
    { t: 'typing', delay: 300, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: '早安 ☕ 今天就是 PPT 汇报日。我昨晚 22:00 之后没打扰你休息，看到你 23:10 把稿子完成了 💪' },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'gold',
      title: '📋 今日冲刺日程',
      rows: [
        { time: '08:30', event: '专车已预约 · 避开早高峰' },
        { time: '09:15', event: '到办公室，最后预演一遍（30 分钟）' },
        { time: '11:00', event: '和产品总监同步核心数据（已发会议邀请）' },
        { time: '12:30', event: '清淡午餐送到（帮你订了温补类）' },
        { time: '14:00', event: '🎯 Q2 经营分析汇报' },
        { time: '15:30', event: '自动缓冲出空档，让你缓一缓' },
      ],
      highlight: { tone: 'gold', text: '💎 汇报前我会帮你开启勿扰，让你专注状态' },
    }},
    { t: 'text', sender: 'xiaoyi', delay: 600, text: '这周还有 2 个 deadline，我已经在后台帮你准备初稿了。今天你就专心拿下 Q2，剩下的我跟你一起打 💪' },
  ],
};

const S_BUTLER = {
  id: 'butler',
  name: '生活管家',
  icon: '💝',
  tagline: '灵魂伴侣 · 贴心管家',
  intro: '小移记得你的胃、你女朋友的喜好和重要日子。从午餐到约会一站安排——这不是功能，是真正懂你的人。',
  traditional: [
    { text: '忙到没空想午饭吃什么', bad: true },
    { text: '约会买礼物总是临阵磨枪', bad: true },
    { text: '忘了女朋友的喜好和纪念日', bad: true },
    { text: '下班还要操心选餐厅打车', bad: true },
  ],
  xiaoyi: [
    { text: '记住你的每一个小习惯' },
    { text: '懂你女朋友的喜好和心思' },
    { text: '从午餐到约会一站安排' },
    { text: '像贴心的伴侣替你想到一切' },
  ],
  metric: { before: '手忙脚乱', after: '从容赴约', save: '每日省心 2 小时' },
  soul: {
    phone: '138****6789',
    tier: '🏅 全球通铂金 · 灵魂伴侣',
    score: 92,
    radar: [90, 85, 95, 88, 78],
    tags: [
      { t: '口味偏清淡' }, { t: '爱吃日料' }, { t: '女友记录' },
      { t: '浪漫型' }, { t: '铂金会员' }, { t: '记得纪念日' },
      { t: '偏好鲜花' },
    ],
    stats: { days: 120, proactive: 380, saved: 3680, time: 88 },
  },
  steps: [
    { t: 'divider', text: '周五 · 12:15' },
    { t: 'typing', delay: 300, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: '我看到你 11:30 的会还在开，应该还没吃午饭吧？😊 你今早吃了胃药，我帮你点点清淡的？' },
    { t: 'rcs', sender: 'xiaoyi', delay: 400, card: {
      tone: 'success',
      title: '🍱 今日午餐推荐',
      subtitle: '综合你的口味 + 胃部状态',
      fields: [
        { label: '菜品', value: '三文鱼亲子饭 + 茶碗蒸 + 味噌汤' },
        { label: '来自', value: '本町日料（你常吃）' },
        { label: '配送', value: '13:00 准时送到办公室' },
        { label: '金额', value: '¥88（积分抵扣后 ¥72）' },
      ],
      highlight: { tone: 'brand', text: '💡 少盐少油，你的胃正在养，适合' },
      buttons: [
        { text: '✅ 就这个', action: 'order', tone: 'primary', userText: '就这个' },
        { text: '换一个', action: 'switch' },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 300, dur: 1100 },
    { t: 'text', sender: 'xiaoyi', text: '✅ 已下单，13:00 送到前台。你继续开会，放心 ☕' },
    { t: 'divider', text: '同日 · 16:30' },
    { t: 'typing', delay: 300, dur: 1400, soul: { tagAdd: '深度懂你', scoreAdd: 4 } },
    { t: 'text', sender: 'xiaoyi', text: '悄悄提醒一下：今晚 19:00 是你和小美的约会 💕 而且……' },
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'gold',
      title: '💝 今天是特别的日子',
      subtitle: '你和小美在一起的第 500 天',
      bullets: [
        '💐 小美最近在朋友圈夸了 3 次某款香水',
        '🍽️ 她收藏了"外滩源 2 号"的招牌位置',
        '🎁 上次送她的蒂芙尼项链她很喜欢',
        '📅 明天她休息，可以晚一点没关系',
      ],
      highlight: { tone: 'gold', text: '🌸 我帮你把今晚都安排好了，你只负责到场' },
    }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'brand',
      title: '🌹 今晚约会方案',
      rows: [
        { time: '18:00', event: '专车 · 准时到公司接你' },
        { time: '18:30', event: '到 BFC · Jo Malone 专柜（礼物已选好）' },
        { time: '18:55', event: '到外滩源 2 号餐厅（窗边浪漫位）' },
        { time: '19:00', event: '🌟 和小美相会' },
        { time: '20:30', event: '江边散步（第一次约会也是这里 💕）' },
      ],
      highlight: { tone: 'brand', text: '💎 500 天纪念，所有细节已就位' },
    }},
    { t: 'rcs', sender: 'xiaoyi', delay: 500, card: {
      tone: 'gold',
      title: '🎁 帮你选好的礼物',
      subtitle: 'Jo Malone · 蓝风铃香水 50ml',
      bullets: [
        '✓ 小美上周朋友圈发过「好想要」',
        '✓ 配套手写卡片已为你拟好（可改）',
        '✓ 18:30 专柜已预留，直接拿走',
        '✓ ¥1,280（已用你的银联权益减 ¥200）',
      ],
      highlight: { tone: 'gold', text: '💌 卡片草稿：「500 天，谢谢你还在我身边 ❤️」' },
      buttons: [
        { text: '💕 就这个', action: 'confirm', tone: 'primary', userText: '完美，就这个' },
        { text: '换一个', action: 'other' },
      ],
    }},
    { t: 'pause', replies: [] },
    { t: 'typing', delay: 300, dur: 1200 },
    { t: 'text', sender: 'xiaoyi', text: '✅ 都办妥了。餐厅我特地提醒他们把那首《月亮代表我的心》加进歌单里 🎵' },
    { t: 'text', sender: 'xiaoyi', delay: 600, text: '你今晚好好享受 ❤️ 我把所有工作消息都静音到明早 9 点。这是属于你们的夜晚 🌙' },
    { t: 'rcs', sender: 'xiaoyi', delay: 600, card: {
      tone: 'gold',
      title: '💎 这就是灵魂伴侣',
      bullets: [
        '记得你的胃，帮你点清淡的午饭',
        '记得你们的纪念日，提前送上祝福',
        '记得她爱的香水，帮你准备礼物',
        '记得你们第一次约会的地方',
        '记得让你安心享受今晚',
      ],
      highlight: { tone: 'brand', text: '🌸 不是功能，是真正懂你的人' },
    }, soul: { tagAdd: '灵魂级信任', scoreAdd: 6, statPatch: { proactive: 395, saved: 3880 } }},
  ],
};

const SCENARIOS = [S1_TARIFF, S2_SMS, S3_FLIGHT, S4_VIP, S_SECRETARY, S_EXAM, S_DEADLINE, S_BUTLER, S5_EVOLUTION];

/* ============================================================
   SOUL RADAR CHART (5 dimensions, SVG)
   ============================================================ */
function SoulRadar({ data, size = 160 }) {
  const dims = ['通信', '出行', '消费', '节奏', '家庭'];
  const cx = size / 2, cy = size / 2;
  const R = size * 0.38;
  const angle = (i) => (-Math.PI/2) + (i * 2 * Math.PI / 5);
  const point = (i, r) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r];
  const ringPath = (r) => dims.map((_,i) => { const [x,y] = point(i,r); return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ') + 'Z';
  const dataPath = dims.map((_,i) => { const [x,y] = point(i, R * (data[i]||0) / 100); return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{width:'100%',maxWidth:size,height:'auto'}}>
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0.08"/>
        </radialGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((k,i) => (
        <path key={i} d={ringPath(R*k)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      ))}
      {dims.map((_,i) => { const [x,y] = point(i,R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>; })}
      <path d={dataPath} fill="url(#radarGlow)" stroke="#3B82F6" strokeWidth="1.5" style={{transition:'d 0.8s ease'}}/>
      {dims.map((d,i) => { const [x,y] = point(i, R + 12); return <text key={d} x={x} y={y} fill="#94a3b8" fontSize="10" textAnchor="middle" dominantBaseline="middle">{d}</text>; })}
      {dims.map((_,i) => { const [x,y] = point(i, R * (data[i]||0) / 100); return <circle key={i} cx={x} cy={y} r="3" fill="#60A5FA"/>; })}
    </svg>
  );
}

/* ============================================================
   SOUL PROFILE PANEL (right column)
   ============================================================ */
function SoulPanel({ soul, freshTags }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {/* Header */}
      <div className="soul-card" style={{textAlign:'center'}}>
        <div style={{width:62,height:62,borderRadius:'50%',background:'linear-gradient(135deg,#0066FF,#8B5CF6)',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,boxShadow:'0 8px 24px rgba(0,102,255,0.4)'}}>👤</div>
        <div style={{marginTop:10,fontSize:15,fontWeight:700}}>{soul.phone}</div>
        <div style={{fontSize:11,color:'#94a3b8',marginTop:3}}>{soul.tier}</div>
      </div>

      {/* Radar */}
      <div className="soul-card">
        <div style={{fontSize:11,color:'#94a3b8',fontWeight:600,marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span>Soul 理解度</span>
          <span style={{fontSize:18,fontWeight:800,background:'linear-gradient(135deg,#60A5FA,#FBBF24)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{soul.score}%</span>
        </div>
        <div style={{display:'flex',justifyContent:'center'}}>
          <SoulRadar data={soul.radar} size={170}/>
        </div>
      </div>

      {/* Tags */}
      <div className="soul-card">
        <div style={{fontSize:11,color:'#94a3b8',fontWeight:600,marginBottom:8,display:'flex',justifyContent:'space-between'}}>
          <span>用户画像标签</span>
          <span style={{color:'#60A5FA'}}>{soul.tags.length} 个</span>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
          {soul.tags.map((tag,i) => (
            <span key={`${tag.t}-${i}`} className={`soul-tag ${freshTags.includes(tag.t)?'fresh':''}`}>{tag.t}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="soul-card">
        <div style={{fontSize:11,color:'#94a3b8',fontWeight:600,marginBottom:8}}>交互数据</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <div className="stat-box"><div className="num">{soul.stats.days}</div><div className="lbl">交互天数</div></div>
          <div className="stat-box"><div className="num">{soul.stats.proactive}</div><div className="lbl">主动服务</div></div>
          <div className="stat-box"><div className="num">¥{soul.stats.saved}</div><div className="lbl">已省金额</div></div>
          <div className="stat-box"><div className="num">{soul.stats.time}h</div><div className="lbl">节省时间</div></div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LEFT PANEL (scenario info + comparison)
   ============================================================ */
function LeftPanel({ scenario }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div className="panel-card">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
          <div style={{width:40,height:40,borderRadius:12,background:'linear-gradient(135deg,#0066FF,#3B82F6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,boxShadow:'0 6px 16px rgba(0,102,255,0.4)'}}>{scenario.icon}</div>
          <div>
            <div style={{fontSize:17,fontWeight:800}}>{scenario.name}</div>
            <div style={{fontSize:11,color:'#60A5FA',fontWeight:600}}>{scenario.tagline}</div>
          </div>
        </div>
        <div style={{fontSize:12.5,color:'#cbd5e1',lineHeight:1.65}}>{scenario.intro}</div>
      </div>

      {/* Metric comparison */}
      <div className="panel-card" style={{padding:'14px 18px'}}>
        <div style={{fontSize:11,color:'#94a3b8',fontWeight:600,marginBottom:10}}>⚡ 效果对比</div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{flex:1,textAlign:'center',padding:'10px 6px',background:'rgba(255,255,255,0.03)',borderRadius:10}}>
            <div style={{fontSize:10,color:'#888',marginBottom:3}}>传统</div>
            <div style={{fontSize:14,fontWeight:700,color:'#94a3b8',textDecoration:'line-through'}}>{scenario.metric.before}</div>
          </div>
          <I.Arrow width="18" height="18" style={{color:'#60A5FA'}}/>
          <div style={{flex:1,textAlign:'center',padding:'10px 6px',background:'linear-gradient(135deg,rgba(0,102,255,0.18),rgba(59,130,246,0.08))',borderRadius:10,border:'1px solid rgba(0,102,255,0.4)'}}>
            <div style={{fontSize:10,color:'#60A5FA',marginBottom:3}}>小移</div>
            <div style={{fontSize:14,fontWeight:800,background:'linear-gradient(135deg,#60A5FA,#FBBF24)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{scenario.metric.after}</div>
          </div>
        </div>
        <div style={{marginTop:10,textAlign:'center',padding:8,background:'rgba(52,199,89,0.1)',borderRadius:10,fontSize:12,color:'#6EE7B7',fontWeight:600}}>🎯 {scenario.metric.save}</div>
      </div>

      {/* Traditional vs Xiaoyi */}
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div className="compare-col old">
          <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:6,display:'flex',alignItems:'center',gap:6}}>
            <I.X width="13" height="13"/>传统方式
          </div>
          {scenario.traditional.map((it,i) => (
            <div key={i} className="compare-step"><span className="marker">✗</span><span>{it.text}</span></div>
          ))}
        </div>
        <div className="compare-col new">
          <div style={{fontSize:11,fontWeight:700,color:'#60A5FA',marginBottom:6,display:'flex',alignItems:'center',gap:6}}>
            <I.Check width="13" height="13"/>小移方式
          </div>
          {scenario.xiaoyi.map((it,i) => (
            <div key={i} className="compare-step"><span className="marker" style={{color:'#60A5FA'}}>✓</span><span>{it.text}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TIMELINE VIEW (for scenario 5)
   ============================================================ */
function TimelineView({ scenario }) {
  return (
    <div style={{width:'100%',maxWidth:720,background:'linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.1))',border:'1px solid rgba(255,255,255,0.08)',borderRadius:24,overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
      <div style={{padding:'20px 24px 12px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{fontSize:11,color:'#60A5FA',fontWeight:700,letterSpacing:1}}>SOUL EVOLUTION TIMELINE</div>
        <div style={{fontSize:22,fontWeight:900,marginTop:4,background:'linear-gradient(135deg,#60A5FA 0%,#FFFFFF 50%,#FBBF24 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>灵魂进化：从陌生人到伙伴</div>
        <div style={{fontSize:12,color:'#94a3b8',marginTop:4}}>跟随时间线见证小移如何越用越懂你 · 滚动查看完整进化历程</div>
      </div>

      <div className="timeline" style={{maxHeight:560,overflowY:'auto'}}>
        {scenario.timeline.map((node,i) => (
          <div key={i} className="timeline-node" style={{animation:`slide-up-fade 0.6s ${i*0.15}s both`}}>
            <div className="timeline-dot">{node.icon}</div>
            <div className="timeline-card">
              <div className="phase">{node.phase}</div>
              <div className="title">{node.title}</div>
              {node.dialogues.map((d,j) => (
                <div key={j} className={`dialogue ${d.role==='user'?'user':''}`}>
                  <div style={{fontSize:10,fontWeight:700,marginBottom:2,color:d.role==='user'?'#9ca3af':'#60A5FA'}}>{d.role==='user'?'👤 用户':'🤖 小移'}</div>
                  <div style={{whiteSpace:'pre-line'}}>{d.text}</div>
                </div>
              ))}
              <div className="soul-update-strip">📈 Soul 档案更新：{node.soulUpdate}</div>
            </div>
          </div>
        ))}

        {/* Moat callout */}
        <div className="moat-card" style={{margin:'16px 0 6px',animation:'slide-up-fade 0.6s 0.9s both'}}>
          <div style={{fontSize:14,fontWeight:800,color:'#FCA5A5',marginBottom:10}}>⚠️ 如果此时更换到其他运营商...</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:12}}>
            {[
              '丢失 180 天积累的 Soul 档案',
              '新 AI 需要从零开始学习',
              '不再有精准的预测式服务',
              '不再有每日专属日报',
              '不再有航班延误主动提醒',
              '不再有垃圾短信智能过滤',
            ].map((t,i) => (
              <div key={i} style={{display:'flex',gap:6,color:'#fecaca'}}>
                <span style={{color:'#FF6B6B'}}>❌</span>{t}
              </div>
            ))}
          </div>
          <div style={{marginTop:14,padding:12,background:'linear-gradient(135deg,rgba(0,102,255,0.2),rgba(59,130,246,0.1))',border:'1px solid rgba(0,102,255,0.4)',borderRadius:12,fontSize:13,color:'#bfdbfe',textAlign:'center',fontWeight:600}}>
            💎 这就是"灵魂壁垒"——比 Poke.com 更深的用户粘性武器
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PHONE SIMULATOR — core playback engine
   ============================================================ */
function PhoneSimulator({ scenario, soul, setSoul, freshTags, setFreshTags, sessionKey }) {
  const [played, setPlayed] = useState([]);  // rendered steps
  const [idx, setIdx] = useState(0);         // index in scenario.steps
  const [typing, setTyping] = useState(false);
  const [waiting, setWaiting] = useState(false); // awaiting user action
  const [done, setDone] = useState(false);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  // Reset when scenario changes
  useEffect(() => {
    setPlayed([]); setIdx(0); setTyping(false); setWaiting(false); setDone(false);
  }, [sessionKey]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 1000;
    }
  }, [played, typing]);

  // Apply soul patch from a step (adds tags, updates score/stats)
  const applySoul = useCallback((soulPatch) => {
    if (!soulPatch) return;
    setSoul(prev => {
      const next = { ...prev };
      if (soulPatch.tagAdd) {
        const exists = prev.tags.some(x => x.t === soulPatch.tagAdd);
        if (!exists) {
          next.tags = [...prev.tags, { t: soulPatch.tagAdd }];
          setFreshTags(ft => [...ft, soulPatch.tagAdd]);
          setTimeout(() => setFreshTags(ft => ft.filter(x => x !== soulPatch.tagAdd)), 3600);
        }
      }
      if (soulPatch.scoreAdd) next.score = Math.min(100, prev.score + soulPatch.scoreAdd);
      if (soulPatch.radarBoost) next.radar = prev.radar.map((v,i) => Math.min(100, v + (soulPatch.radarBoost[i]||0)));
      if (soulPatch.statPatch) next.stats = { ...prev.stats, ...soulPatch.statPatch };
      return next;
    });
  }, [setSoul, setFreshTags]);

  // Play the next step (auto-advance loop)
  const playStep = useCallback(() => {
    const step = scenario.steps[idx];
    if (!step) { setDone(true); return; }

    if (step.t === 'pause') {
      // Pause and wait for user
      setWaiting(true);
      return;
    }

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

    // Render step
    setPlayed(p => [...p, { ...step, _k: Math.random().toString(36).slice(2) }]);
    if (step.soul) applySoul(step.soul);
    const d = step.delay || 600;
    timerRef.current = setTimeout(() => setIdx(i => i + 1), d);
  }, [idx, scenario.steps, applySoul]);

  // Tick the engine
  useEffect(() => {
    if (!waiting && !done) {
      const t = setTimeout(playStep, 50);
      return () => clearTimeout(t);
    }
  }, [idx, waiting, done, playStep]);

  // Cleanup timers on scenario change
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, [sessionKey]);

  // Handle user action (quick reply or card button)
  const handleAction = useCallback((action, label) => {
    if (label) {
      setPlayed(p => [...p, { t: 'text', sender: 'user', text: label, _k: Math.random().toString(36).slice(2) }]);
    }
    setWaiting(false);
    setIdx(i => i + 1);
  }, []);

  // Fast-forward: play all remaining steps instantly
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

  // Current pause step's replies
  const currentPause = waiting ? scenario.steps[idx] : null;

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
      <div className="phone-frame">
        <div className="phone-notch"/>
        <div className="phone-screen">
          <StatusBar/>
          <SmsHeader/>
          <div className="chat-area" ref={scrollRef}>
            {played.map((m,i) => {
              if (m.t === 'text' || m.t === 'system' || m.t === 'divider') {
                return <MessageBubble key={m._k||i} msg={{ type:m.t==='text'?'text':m.t, sender:m.sender, text:m.text }}/>;
              }
              if (m.t === 'rcs') {
                return <RCSCard key={m._k||i} card={m.card} onAction={handleAction}/>;
              }
              if (m.t === 'multi') {
                return <RCSMulti key={m._k||i} cards={m.cards} onAction={handleAction}/>;
              }
              if (m.t === 'junk') {
                return <JunkSMSInbox key={m._k||i} items={m.items}/>;
              }
              return null;
            })}
            {typing && <TypingIndicator/>}
            {done && (
              <div className="msg-row system animate-slide-up">
                <div className="bubble system" style={{background:'linear-gradient(135deg,rgba(0,102,255,0.15),rgba(139,92,246,0.1))',color:'#93c5fd',fontWeight:600}}>
                  🎉 场景演示结束 · 体验下一个场景继续探索
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="input-area">
            {currentPause && currentPause.replies && currentPause.replies.length > 0 && (
              <div className="quick-replies no-scrollbar">
                {currentPause.replies.map((r,i) => (
                  <button key={i} className={`quick-reply ${r.primary?'primary':''}`} onClick={() => handleAction(r.action, r.user?r.label:null)}>
                    {r.label}
                  </button>
                ))}
              </div>
            )}
            {!currentPause && !done && (
              <div className="quick-replies no-scrollbar">
                <span className="quick-reply" style={{opacity:0.6,cursor:'default'}}>💬 小移正在服务中...</span>
              </div>
            )}
            {done && (
              <div className="quick-replies no-scrollbar">
                <span className="quick-reply" style={{opacity:0.6,cursor:'default'}}>✨ 继续探索下一场景</span>
              </div>
            )}
            <div className="input-row">
              <input placeholder="短信  ·  与小移对话" readOnly/>
              <button aria-label="发送"><I.Send width="16" height="16"/></button>
            </div>
          </div>
        </div>
      </div>

      {/* Phone controls */}
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <button onClick={fastForward} disabled={done || waiting} style={{padding:'8px 16px',borderRadius:20,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'#cbd5e1',fontSize:12,cursor:(done||waiting)?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:6,opacity:(done||waiting)?0.4:1}}>
          <I.Fast width="12" height="12"/>快进到下个节点
        </button>
        <button onClick={() => { setPlayed([]); setIdx(0); setTyping(false); setWaiting(false); setDone(false); setSoul(scenario.soul); setFreshTags([]); }} style={{padding:'8px 16px',borderRadius:20,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'#cbd5e1',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
          <I.Replay width="12" height="12"/>重播场景
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   WELCOME SCREEN
   ============================================================ */
function WelcomeScreen({ onEnter }) {
  const particles = useMemo(() => Array.from({length:40}).map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    dx: (Math.random() - 0.5) * 300 + 'px',
    dy: (Math.random() - 0.5) * 300 + 'px',
    delay: Math.random() * 6,
    size: 2 + Math.random() * 3,
  })), []);

  return (
    <div className="welcome-overlay">
      {particles.map((p,i) => (
        <div key={i} className="welcome-particle" style={{
          left: p.left+'%', top: p.top+'%',
          width: p.size, height: p.size,
          animationDelay: p.delay + 's',
          '--dx': p.dx, '--dy': p.dy,
        }}/>
      ))}

      <div style={{textAlign:'center',position:'relative',zIndex:2,padding:20}}>
        <div style={{fontSize:13,color:'#60A5FA',letterSpacing:3,fontWeight:600,marginBottom:16,opacity:0.9}}>
          ✨ 中国移动 × AI 智能管家
        </div>
        <h1 className="welcome-title animate-slide-up">小移</h1>
        <div style={{fontSize:22,fontWeight:300,color:'#e2e8f0',marginTop:16,letterSpacing:2,animation:'slide-up-fade 0.7s 0.15s both'}}>
          AI 赋能短信入口  ·  重塑运营商 C 端连接
        </div>
        <div style={{fontSize:15,color:'#94a3b8',marginTop:30,lineHeight:2,animation:'slide-up-fade 0.8s 0.3s both'}}>
          <div>🏠 生活在你<span style={{color:'#60A5FA',fontWeight:600}}>短信</span>里的 AI 管家</div>
          <div style={{marginTop:6}}>
            <span style={{color:'#FBBF24'}}>零安装</span>  ·  <span style={{color:'#60A5FA'}}>主动服务</span>  ·  <span style={{color:'#A78BFA'}}>越用越懂你</span>
          </div>
        </div>

        <div style={{marginTop:50,animation:'slide-up-fade 0.9s 0.5s both'}}>
          <button className="glow-btn" onClick={onEnter}>
            开始体验 →
          </button>
        </div>

        <div style={{marginTop:32,fontSize:12,color:'#64748b',animation:'slide-up-fade 1s 0.7s both'}}>
          面向 9 亿用户  ·  5 大核心场景  ·  超越 Poke.com
        </div>
      </div>

      <div style={{position:'absolute',bottom:28,left:0,right:0,textAlign:'center',fontSize:11,color:'#475569',letterSpacing:2}}>
        HUAWEI × 中国移动
      </div>
    </div>
  );
}

/* ============================================================
   HEADER (brand + scenario tabs)
   ============================================================ */
function Header({ current, onSelect }) {
  return (
    <div style={{padding:'16px 28px',borderBottom:'1px solid rgba(255,255,255,0.06)',backdropFilter:'blur(20px)',background:'rgba(10,10,26,0.55)',position:'sticky',top:0,zIndex:50}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap'}}>
        {/* Brand */}
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:40,height:40,borderRadius:12,background:'linear-gradient(135deg,#0066FF,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 20px rgba(0,102,255,0.5)',position:'relative'}}>
            <span style={{fontSize:20,fontWeight:900,color:'#fff'}}>移</span>
            <span style={{position:'absolute',top:-3,right:-3,width:10,height:10,background:'#34C759',border:'2px solid #0A0A1A',borderRadius:'50%'}}/>
          </div>
          <div>
            <div style={{fontSize:18,fontWeight:800,background:'linear-gradient(135deg,#FFFFFF,#94a3b8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:-0.5}}>小移 Xiaoyi</div>
            <div style={{fontSize:10,color:'#64748b',letterSpacing:1}}>中国移动 · AI 智能管家</div>
          </div>
        </div>

        {/* Scene tabs */}
        <div style={{display:'flex',gap:6,flexWrap:'wrap',justifyContent:'center'}}>
          {SCENARIOS.map((s,i) => (
            <button key={s.id} className={`scene-tab ${current===i?'active':''}`} onClick={() => onSelect(i)}>
              <span>{s.icon}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [current, setCurrent] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);
  const scenario = SCENARIOS[current];
  const [soul, setSoul] = useState(scenario.soul);
  const [freshTags, setFreshTags] = useState([]);

  // Reset soul and session when scenario changes
  useEffect(() => {
    setSoul(scenario.soul);
    setFreshTags([]);
    setSessionKey(k => k + 1);
  }, [current]);

  const handleSelect = (i) => {
    if (i === current) return;
    setCurrent(i);
  };

  const isTimeline = scenario.id === 'evolution';

  return (
    <Fragment>
      {showWelcome && <WelcomeScreen onEnter={() => setShowWelcome(false)}/>}

      <Header current={current} onSelect={handleSelect}/>

      <main style={{padding:'24px 28px 40px',minHeight:'calc(100vh - 140px)'}}>
        <div style={{display:'grid',gridTemplateColumns:'minmax(260px, 320px) 1fr minmax(260px, 320px)',gap:24,maxWidth:1480,margin:'0 auto'}}>
          {/* Left */}
          <div>
            <LeftPanel scenario={scenario}/>
          </div>

          {/* Center: phone or timeline */}
          <div style={{display:'flex',justifyContent:'center',alignItems:'flex-start',paddingTop:8}}>
            {isTimeline ? <TimelineView scenario={scenario}/> : <PhoneSimulator scenario={scenario} soul={soul} setSoul={setSoul} freshTags={freshTags} setFreshTags={setFreshTags} sessionKey={sessionKey}/>}
          </div>

          {/* Right */}
          <div>
            <SoulPanel soul={soul} freshTags={freshTags}/>
          </div>
        </div>

        {/* Transition hint */}
        <div style={{maxWidth:1480,margin:'30px auto 0',textAlign:'center'}}>
          {current < SCENARIOS.length - 1 && (
            <button onClick={() => handleSelect(current+1)} style={{padding:'12px 26px',borderRadius:999,background:'linear-gradient(135deg,rgba(0,102,255,0.15),rgba(139,92,246,0.1))',border:'1px solid rgba(0,102,255,0.3)',color:'#93c5fd',fontSize:13,fontWeight:600,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8}}>
              体验下一场景：{SCENARIOS[current+1].icon} {SCENARIOS[current+1].name} <I.Arrow width="14" height="14"/>
            </button>
          )}
          {current === SCENARIOS.length - 1 && (
            <button onClick={() => handleSelect(0)} style={{padding:'12px 26px',borderRadius:999,background:'linear-gradient(135deg,rgba(255,149,0,0.2),rgba(251,191,36,0.1))',border:'1px solid rgba(255,149,0,0.4)',color:'#FBBF24',fontSize:13,fontWeight:600,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8}}>
              🎯 回到起点重新体验
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{padding:'20px 28px',borderTop:'1px solid rgba(255,255,255,0.05)',textAlign:'center',fontSize:11,color:'#475569',letterSpacing:1}}>
        © 2026 小移 Xiaoyi · 中国移动 AI 智能管家 · Demo v1.0  ·  面向 9 亿用户的灵魂伙伴
      </footer>
    </Fragment>
  );
}

/* ============================================================
   MOUNT
   ============================================================ */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
