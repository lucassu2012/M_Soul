<div align="center">

<img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" alt="React 18"/>
<img src="https://img.shields.io/badge/Babel-Standalone-f5da55?logo=babel&logoColor=black" alt="Babel"/>
<img src="https://img.shields.io/badge/i18n-zh%20%7C%20en-0066ff" alt="Bilingual"/>
<img src="https://img.shields.io/badge/Icons-Lucide%2040%2B-4a90d9" alt="Lucide Icons"/>
<img src="https://img.shields.io/badge/Mobile-Responsive-34c759" alt="Responsive"/>

# Xiaoyi 小移

**AI Soul Companion living in your SMS**

China Mobile AI Soul Companion &middot; Interactive Demo

[English](#english) &middot; [中文](#中文)

</div>

---

<a id="english"></a>

## What is Xiaoyi?

**Xiaoyi** is an AI soul companion designed for China Mobile's 900 million subscribers. Unlike standalone apps, Xiaoyi lives inside the native SMS / RCS messaging app on your phone — **zero installation required**. It learns your habits, anticipates your needs, and evolves into a personal life partner over time.

This repository contains an **interactive web demo** that lets decision-makers experience Xiaoyi's vision hands-on through 9 carefully crafted scenarios.

## Live Demo

Open `index.html` in any modern browser, or deploy to GitHub Pages:

```
https://<your-username>.github.io/M_Soul/
```

No build step, no npm install, no server — just open and run.

## 9 Core Scenarios

| # | Scenario | Key Capability | What It Demonstrates |
|---|----------|---------------|---------------------|
| 1 | **Smart Plan Manager** | Reactive + AI Recommendation | Analyzes real usage data, recommends optimal plan, switches with one tap. Saves ¥840/year. |
| 2 | **SMS Hub** | Carrier-Exclusive Data Moat | Transforms a noisy inbox into a smart feed. Auto-filters scams, classifies packages/bills/flights into actionable cards. |
| 3 | **Flight Rescue** | Proactive Service | Detects flight delays before you check, pushes train alternatives, re-plans your entire day including calendar sync. |
| 4 | **GoTone Premium** | Premium Differentiation | Daily personal briefing, weather-schedule-traffic sync, auto-booked Platinum cars, family coordination. Makes ¥158/month feel worth it. |
| 5 | **Trip Secretary** | Soul Companion | Spots an upcoming Tokyo trip from your calendar. Books flight, hotel, car, roaming pack. Sends weather/dress tips and a pre-trip checklist. |
| 6 | **Exam Coach** | Soul Companion | Detects CFA exam in 18 days. Builds a study plan, enables focus mode, filters 186 messages, and walks you to exam day with encouragement. |
| 7 | **Work Rescue** | Soul Companion | Cross-reads email + calendar + chats, spots 3 colliding deadlines, generates a 12-slide draft deck, shields you from distractions. |
| 8 | **Life Butler** | Soul Companion | Remembers your stomach meds, orders light lunch. Recognizes your 500-day anniversary, picks the perfume she wished for, books the restaurant where you first dated. |
| 9 | **Soul Evolution** | Retention Moat | A 180-day timeline showing how Xiaoyi evolves from stranger to soul partner — and why switching carriers means losing it all. |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (CDN, no build step) |
| JSX Compilation | Babel Standalone (in-browser) |
| Styling | Custom CSS with design token system (CSS custom properties) |
| Icons | 40+ Lucide icons (inline SVG, zero emoji in UI chrome) |
| i18n | Built-in `t()` helper with `{zh, en}` bilingual objects |
| Responsive | Mobile-first breakpoints at 1280 / 1024 / 768 / 480 px |
| Mobile UX | Side-panel drawers, horizontal scroll tabs, touch-friendly targets |

## File Structure

```
M_Soul/
├── index.html      (30 lines)   — Shell: CDN imports, ambient background
├── styles.css      (1,280 lines) — Design tokens, phone simulator, RCS cards,
│                                    animations, responsive breakpoints, drawers
├── app.jsx         (2,423 lines) — React app: i18n, Lucide icons, 9 scenarios,
│                                    playback engine, Soul profile panel
├── .nojekyll                     — Prevents Jekyll on GitHub Pages
└── README.md                     — This file
```

## Design System

### Token Architecture

All visual properties are centralized in CSS custom properties:

- **Colors**: `--bg-*`, `--text-*`, `--border-*`, `--brand-*`, `--success/danger/warning/gold`
- **Spacing**: `--s-1` through `--s-10` (4px to 40px)
- **Radii**: `--r-xs` through `--r-full`
- **Shadows**: `--shadow-sm/md/lg/glow/card`
- **Typography**: `--fs-xs` through `--fs-4xl`
- **Layout**: `--layout-header-h`, `--layout-max-w`, `--layout-touch` (44px)

### Component Patterns

- **Card** — Translucent panel with backdrop blur
- **IconBadge** — Gradient container for Lucide icons
- **RCSCard** — Rich card with fields, progress bars, highlights, action buttons
- **Drawer** — Slide-in side panel (left/right) with overlay + escape-key dismiss
- **SoulRadar** — SVG 5-dimension radar chart with animated data transitions

### Interaction Model

Buttons fall into two categories:

| Type | Trigger | Behavior |
|------|---------|----------|
| **Flow** | Has `userText` field | Advances scripted narrative (only when engine is paused) |
| **Decorative** | No `userText` | Shows user bubble + contextual Xiaoyi ack, stays paused |

Every button produces a visible response. No dead-end clicks.

---

<a id="中文"></a>

## 小移是什么？

**小移**是面向中国移动 9 亿用户的 AI 灵魂伴侣。它不是一个独立 App，而是生活在用户手机原生短信 / RCS 消息应用中的 AI 助手——**零安装**。小移通过持续学习用户习惯，预测需求，逐渐进化为贴身的生活伙伴。

本仓库是一个**交互式网页 Demo**，通过 9 个精心设计的场景，让决策者亲手体验小移的产品愿景。

## 9 大核心场景

| # | 场景 | 核心能力 | 演示内容 |
|---|------|---------|---------|
| 1 | **智能套餐管家** | 被动响应 + AI 推荐 | 基于真实使用数据分析套餐利用率，一键切换最优方案，年省 ¥840 |
| 2 | **短信中枢** | 运营商独占数据优势 | 混乱收件箱变智能信息流，诈骗/营销自动过滤，重要信息卡片化 |
| 3 | **航班应对** | 主动服务 | 主动发现航班延误，推送高铁替代方案，结合日历重新规划全天行程 |
| 4 | **全球通尊享** | 高端差异化变现 | 每日专属日报、天气-日程-交通联动、铂金专车、家庭行程协同 |
| 5 | **出差秘书** | 灵魂伴侣 | 从日历识别东京出差，一站式预定机票/酒店/专车/漫游，推送天气着装建议 |
| 6 | **备考加油** | 灵魂伴侣 | 识别 CFA 考试倒计时 18 天，制定学习计划，开启专注模式，过滤 186 条干扰，考前陪伴鼓励 |
| 7 | **工作救援** | 灵魂伴侣 | 跨邮件/日历/协作群识别 3 个 deadline 碰撞，生成 12 页 PPT 初稿，屏蔽打扰 |
| 8 | **生活管家** | 灵魂伴侣 | 记得你吃了胃药点清淡午餐，识别 500 天纪念日，选好她想要的香水，订下你们第一次约会的餐厅 |
| 9 | **灵魂进化** | 用户留存壁垒 | 180 天时间线展示从陌生人到灵魂伙伴的进化——以及为什么换运营商意味着全部丢失 |

## 技术栈

| 层级 | 技术 |
|------|------|
| UI 框架 | React 18（CDN 直接加载，无构建步骤） |
| JSX 编译 | Babel Standalone（浏览器端编译） |
| 样式 | 原生 CSS + 设计 Token 体系（CSS 自定义属性） |
| 图标 | 40+ Lucide 图标（内联 SVG，UI 层零 emoji） |
| 国际化 | 内置 `t()` 双语翻译函数，支持中英文一键切换 |
| 响应式 | 移动端优先，4 个断点（1280 / 1024 / 768 / 480） |
| 移动体验 | 侧边栏抽屉、横向滚动标签页、触控友好（最小 44px） |

## 文件结构

```
M_Soul/
├── index.html      (30 行)     — 壳：CDN 引入、背景层
├── styles.css      (1,280 行)  — 设计 Token、手机模拟器、RCS 卡片、动画、响应式、抽屉
├── app.jsx         (2,423 行)  — React 应用：国际化、Lucide 图标、9 场景、播放引擎、Soul 档案
├── .nojekyll                   — 防止 GitHub Pages 上的 Jekyll 处理
└── README.md                   — 本文件
```

Built with React 18 &middot; Lucide Icons &middot; Custom Design System

</div>
