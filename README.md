<div align="center">

<img src="https://raw.githubusercontent.com/Studio1HQ/Studio1HQ/main/assets/banners/v0-f1-favorites-dashboard.webp" alt="F1 Favorites Dashboard with Velt: A Formula 1 data dashboard with comment bubbles on race and driver tables" width="100%" />

<br />
<br />

# F1 Favorites Dashboard with Velt

### A Formula 1 data dashboard with comment bubbles on race and driver tables

A v0-generated Next.js dashboard for Formula 1 sessions and drivers from the OpenF1 API. Velt adds comment bubbles on table rows, a comments sidebar, presence and notifications.

<br />

[![Built by Studio1](https://img.shields.io/badge/Built_by_Studio1-f97316?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiBmaWxsPSJub25lIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAgMzVDMCAxNi42ODA3IDE0LjA3NDQgMS42NDg0NCAzMiAwLjEyNjk1M1YxNDFINTEuMDUyM0M1Mi40MzA4IDEzNy4zNDQgNTQuNzQ0NiAxMzMuNjg5IDU3Ljk5MzggMTMwLjAzM0M2MS4xNDQ2IDEyNi41MDggNjQuNjg5MiAxMjMuNDQgNjguNjI3NyAxMjAuODI5QzcyLjU2NjIgMTE4LjM0OSA3Ni4zNTY5IDExNi43ODIgODAgMTE2LjEyOVY4Ni43NTQ0Qzc1LjQ3MDggODcuOTI5MiA3MS4zODQ2IDg5LjY5MTkgNjcuNzQxNSA5Mi4wNDE1QzY0IDk0LjUyMjUgNjAuNzUwOCA5Ny40NiA1Ny45OTM4IDEwMC44NTRDNTYuNTM0NSAxMDIuNzIgNTUuMjU0NSAxMDQuNjU5IDU0LjE1MzkgMTA2LjY3MVYwSDEyNUMxNDQuMzMgMCAxNjAgMTUuNjY5OSAxNjAgMzVWMTI1QzE2MCAxNDQuMzMgMTQ0LjMzIDE2MCAxMjUgMTYwSDEyNFYxOEgxMDQuOTQ4QzEwMy41NjkgMjEuNjgxNiAxMDEuMjU1IDI1LjM2MjggOTguMDA2MiAyOS4wNDQ0Qzk0Ljg1NTQgMzIuNTk0MiA5MS4zMTA4IDM1LjY4NDEgODcuMzcyMyAzOC4zMTRDODMuNDMzOCA0MC44MTIgNzkuNjQzMSA0Mi4zODk2IDc2IDQzLjA0NzRWNzIuNjMwNEM4MC41MjkyIDcxLjQ0NzMgODQuNjE1NCA2OS42NzI0IDg4LjI1ODUgNjcuMzA1N0M5MiA2NC44MDc2IDk1LjI0OTIgNjEuODQ5MSA5OC4wMDYyIDU4LjQzMDdDOTkuNDY1NSA1Ni41NTEzIDEwMC43NDUgNTQuNTk4NiAxMDEuODQ2IDUyLjU3MjNWMTYwSDM1QzE1LjY3IDE2MCAwIDE0NC4zMyAwIDEyNVYzNVoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4K)](https://studio1hq.com)
[![Built with Velt](https://img.shields.io/badge/Built_with_Velt-141414?style=for-the-badge)](https://velt.dev)
[![Live demo](https://img.shields.io/badge/Live_demo-1c1917?style=for-the-badge&logo=vercel&logoColor=white)](https://f1-dashboard-velt.vercel.app/)

[Velt docs](https://docs.velt.dev) &nbsp;·&nbsp; [Velt](https://velt.dev) &nbsp;·&nbsp; [More examples](https://github.com/Studio1HQ) &nbsp;·&nbsp; [studio1hq.com](https://studio1hq.com)

</div>

<br />

## Overview

F1 Favorites is a Formula 1 historical data dashboard. It lists race sessions and drivers from the public [OpenF1 API](https://openf1.org) and lets a team discuss rows in the tables with [Velt](https://velt.dev) comment bubbles.

The UI was generated with [v0](https://v0.app) from a single prompt and then wired to Velt by hand. A user switcher lets one person test collaboration between several accounts.

<p align="center"><img src="https://github.com/user-attachments/assets/ba67eefc-cbbf-465a-a255-47498e0006a6" alt="F1 Favorites dashboard, v0 generation" width="100%" /></p>
<p align="center"><img src="https://github.com/user-attachments/assets/6bd3adbf-3707-4074-9fe7-4a884a5d8f32" alt="F1 Favorites dashboard, collaboration view" width="100%" /></p>

<details>
<summary>More screenshots</summary>

<p align="center"><img src="https://github.com/user-attachments/assets/591daa45-5e23-4821-9c56-8354f6b89f2f" alt="F1 Favorites dashboard, third screenshot" width="100%" /></p>

</details>

## Features

- **Race sessions table**: Historical sessions fetched from the OpenF1 API, with search and filtering.
- **Drivers table**: Driver data from OpenF1, shown in a second table.
- **Comment bubbles on rows**: `VeltCommentBubble` and `VeltCommentTool` attach comments to table rows.
- **Comments sidebar**: `VeltCommentsSidebar` with a `VeltSidebarButton`.
- **Presence and notifications**: `VeltPresence` and `VeltNotificationsTool` in the dashboard header.
- **User switching**: A user context and switcher re-identify the Velt user.
- **Dashboard shell**: Sidebar navigation with Dashboard, Race Sessions, Drivers, Cars, Analytics and Favorites pages, loading and empty states, and a theme toggle.

## Tech stack

| Layer | Tool |
| --- | --- |
| Framework | [Next.js](https://nextjs.org), [React](https://react.dev), TypeScript |
| Collaboration | [Velt](https://velt.dev) (`@veltdev/react`) |
| Data | [OpenF1 API](https://openf1.org) |
| UI | [Tailwind CSS](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com), [shadcn/ui](https://ui.shadcn.com), [Recharts](https://recharts.org) |
| UI generation | [v0](https://v0.app) |
| Deployment | [Vercel](https://vercel.com) |

## Getting started

### Prerequisites

- Node.js 18 or later
- npm, pnpm or yarn
- A Velt API key from the [Velt console](https://console.velt.dev)

### Installation

```bash
git clone https://github.com/Studio1HQ/v0-f1-favorites-dashboard.git
cd v0-f1-favorites-dashboard
npm install
```

### Environment variables

Create a `.env.local` file in the project root.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_VELT_API_KEY` | Your Velt API key. |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## How it works

```text
app/                       dashboard, drivers, cars, analytics and favorites pages
components/                race-sessions-table, drivers-table, dashboard-layout, user-switcher
components/velt-provider.tsx   VeltProvider wrapper
contexts/user-context.tsx  current user and Velt identify / setDocument
lib/api.ts                 OpenF1 client (https://api.openf1.org/v1)
```

The Velt document ID is `f1-dashboard-v2-2024`, set in `contexts/user-context.tsx`. The original v0 prompt asked for a collaborative, Notion or Linear style dashboard that shows OpenF1 race sessions in the main table, with Drivers, Cars and Analytics as placeholders and collaboration to be added later. The repo was kept in sync with the v0 project, and Vercel deploys from it.

## Resources

- [Live demo](https://f1-dashboard-velt.vercel.app/): the deployed app.
- [OpenF1 API](https://openf1.org): source of the session and driver data.
- [Velt documentation](https://docs.velt.dev): SDK guides.
- [Velt](https://velt.dev): product site.
- [v0](https://v0.app): the tool used to generate the UI.

<br />

---

<div align="center">

<a href="https://studio1hq.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-dark.svg" />
    <img src="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-light.svg" alt="Studio1" width="160" />
  </picture>
</a>

Built by **[Studio1](https://studio1hq.com)**, the technical content and DevRel partner for devtool teams. Made with [Velt](https://velt.dev).<br />
Browse more open-source examples at [github.com/Studio1HQ](https://github.com/Studio1HQ).

[![Website](https://img.shields.io/badge/studio1hq.com-0b0807?style=for-the-badge&logo=googlechrome&logoColor=white)](https://studio1hq.com)
[![Book a call](https://img.shields.io/badge/Book_a_strategy_call-f97316?style=for-the-badge&logo=googlecalendar&logoColor=white)](https://cal.com/studio1/collab)
[![X](https://img.shields.io/badge/%40Studio1HQ-141414?style=for-the-badge&logo=x&logoColor=white)](https://x.com/Studio1HQ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/studio1hq/)

<sub><a href="https://studio1hq.com">studio1hq.com</a> · Technical content, docs, video and DevRel for devtools</sub>

</div>
