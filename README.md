# 🚀 AI Changelog Writer (changelog.)

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Prisma 7](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Groq SDK](https://img.shields.io/badge/Groq%20LLM-Llama--3.3-orange?style=flat-square&logo=openai)](https://groq.com/)
[![BullMQ](https://img.shields.io/badge/Queue-BullMQ%20%26%20Redis-red?style=flat-square&logo=redis)](https://bullmq.io/)

An elegant, **AI-powered developer platform** designed to ingest GitHub Pull Requests, classify their technical impact, and auto-generate beautifully structured, user-facing changelog entries. Built as a high-fidelity workspace with sub-second background execution.

---

## 🎨 Interactive Live Sandbox
We've introduced a state-of-the-art **Interactive Release Lab** directly on the [homepage](file:///c:/Users/hv081/OneDrive/Desktop/Code/changelog-writer/app/page.tsx). Developers can instantly select preset PR diffs (Features, Bugfixes, or Relational Database migrations), run a simulated LLM generation pipeline, and preview real-time SemVer classification updates side-by-side.

---

## ✨ Key Features

*   **Interactive Git Diff Pane**: Live, split-screen code view that color-codes additions and deletions side-by-side, giving complete context to the reviewer.
*   **Live Markdown Preview Workspace**: Tabbed content editor featuring a real-time markdown renderer with elegant typography spacing.
*   **One-Click SemVer Recommendations**: Automatically suggests major, minor, and patch targets based on the AI's impact classification.
*   **Real-Time Command Dashboard**: Search pull requests, filter codebase logs instantly by repository, and trigger instant inline publishing without redirects.
*   **Chronological axis timeline**: Beautiful public-facing history thread utilizing concentric nodes, category borders, and custom GitHub integration badges.
*   **AI-Powered Classification**: Translates complex Git/GitHub PR diffs, titles, and descriptions into clean, present-tense, user-facing summaries.
*   **Multi-category Taxonomy**: Smart classification of changes into FEATURE, BUGFIX, BREAKING, and INTERNAL categories.
*   **Background Job Queue**: Uses Redis & BullMQ to asynchronously process webhooks, run AI generation jobs, and ensure reliable execution.
*   **Database Integration**: Leverages PostgreSQL and Prisma to track GitHub installations, repositories, generated entries, and granular change logs.

---

## 🛠️ Technology Stack

| Technology | Purpose | Key Package(s) |
| :--- | :--- | :--- |
| **Core Framework** | React 19 & Next.js 16 (App Router) | `next`, `react`, `react-dom` |
| **Styling & UI** | Tailwind CSS v4 & Lucide Icons | `tailwindcss`, `lucide-react` |
| **Database ORM** | PostgreSQL Database | `@prisma/client`, `prisma` |
| **AI Processing** | Groq Cloud LLM Integration | `groq-sdk` (running `llama-3.3-70b-versatile`) |
| **Background Tasks** | Redis-backed Job Processing Queue | `bullmq`, `ioredis` |
| **Editor** | Rich Text WYSIWYG Editing | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm` |
| **Authentication** | Secure OAuth Login | `next-auth` |

---

## 📂 Directory Structure

The project has a modular, scalable folder layout:

```text
changelog-writer/
├── app/                      # Next.js App Router (Pages, Layouts, global CSS)
│   ├── generated/            # Automatically generated Prisma client
│   │   └── prisma/
│   ├── globals.css           # Global Tailwind CSS imports and variable tokens
│   ├── layout.tsx            # Main HTML layout, secures app with SessionProvider
│   ├── SessionProvider.tsx   # React Client context for managing user authentication
│   └── page.tsx              # Beautiful, interactive product landing page
├── components/               # Shared frontend components
│   └── ui/
│       └── Nav.tsx           # Navigation bar with login statuses & signOut controls
├── lib/                      # Core backend utilities and services
│   ├── llm/
│   │   └── classifier.ts     # Groq SDK configuration & PR classifier logic
│   ├── queue/
│   │   ├── index.ts          # BullMQ queue & Redis client connection settings
│   │   └── processors/
│   │       └── changelog.processor.ts # Queue worker logic (background processor)
│   └── prisma.ts             # Prisma Client client singleton
├── prisma/
│   ├── schema.prisma         # Database schema (Models, relations, and enums)
│   └── migrations/           # Database schema migrations
├── scripts/
│   └── test-classifier.ts    # CLI script for testing LLM/Groq classifier on fake PRs
├── middleware.ts             # NextAuth routing protection middleware
├── docker-compose.yml        # Multi-container setup for local Postgres & Redis
├── package.json              # Project scripts and dependencies
├── tsconfig.json             # TypeScript compiler settings
└── README.md                 # Project documentation
```

---

## 🗄️ Database Schema (`prisma/schema.prisma`)

The database consists of the following relational models:

```mermaid
erDiagram
    Installation ||--o{ Repo : manages
    Repo ||--o{ ChangelogEntry : contains
    ChangelogEntry ||--o{ Change : groups

    Installation {
        string id PK
        int githubInstallId UK
        string accountLogin
        DateTime createdAt
    }

    Repo {
        string id PK
        string installationId FK
        string owner
        string name
    }

    ChangelogEntry {
        string id PK
        string repoId FK
        string version
        string title
        string rawDiff
        string aiDraft
        string published
        EntryStatus status
        int prNumber
        string commitSha
        DateTime createdAt
        DateTime publishedAt
    }

    Change {
        string id PK
        string entryId FK
        ChangeType type
        string summary
        string[] files
    }
```

### Key Models & Types:
*   **`Installation`**: Tracks authorized GitHub App installations for users/organizations.
*   **`Repo`**: Holds repository metadata linked to an installation.
*   **`ChangelogEntry`**: Captures a single changelog release, raw diffs, AI-generated drafts, and publication details.
*   **`Change`**: Detailed change items mapped to a specific entry, classifying files and impact.
*   **`ChangeType`**: Enum with FEATURE, BUGFIX, BREAKING, and INTERNAL.
*   **`EntryStatus`**: Enum with DRAFT, PUBLISHED, and ARCHIVED.

---

## 🧠 LLM Classification Flow (`lib/llm/classifier.ts`)

The AI engine takes pull request metadata and uses the `llama-3.3-70b-versatile` model to evaluate:
1.  **PR Title & Description**
2.  **Raw Diff Content**

It parses this data into structured JSON matching this schema:
```json
{
  "entryTitle": "Add Google OAuth login and fix button loading state",
  "suggestedVersion": "minor",
  "changes": [
    {
      "type": "FEATURE",
      "summary": "Adds Google OAuth authentication allowing users to sign in with Google.",
      "files": ["src/auth/login.ts"]
    },
    {
      "type": "BUGFIX",
      "summary": "Fixes button loading/flickering UI transitions on slower network connections.",
      "files": ["src/components/Button.tsx"]
    }
  ]
}
```

---

## 🔒 Session Protection & Middleware

To safeguard developer workspaces, we enforce NextAuth Session protection across all workspace directories. 

*   **Global Layout Integration**: [app/layout.tsx](file:///c:/Users/hv081/OneDrive/Desktop/Code/changelog-writer/app/layout.tsx) secures application context with a client-side wrapper ([app/SessionProvider.tsx](file:///c:/Users/hv081/OneDrive/Desktop/Code/changelog-writer/app/SessionProvider.tsx)).
*   **Router Protection**: [middleware.ts](file:///c:/Users/hv081/OneDrive/Desktop/Code/changelog-writer/middleware.ts) actively blocks unauthorized entries, automatically routing unauthenticated traffic on `/dashboard/:path*` to `/login`.

---

## ⚙️ Environment Variables Config (`.env`)

Create a `.env` file in the root directory and configure the following parameters:

```env
DATABASE_URL="postgresql://postgres:dev@localhost:5432/changelog"
REDIS_URL="redis://localhost:6379"
GROQ_API_KEY="your-groq-api-key-here"
```

---

## 🚀 Local Setup & Development

### 1. Prerequisites
Ensure you have the following installed locally:
*   [Node.js](https://nodejs.org/) (v20+ recommended)
*   [pnpm](https://pnpm.io/) (preferred package manager)
*   [Docker](https://www.docker.com/)

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Spin up local database and Redis
Start the Postgres and Redis services defined in `docker-compose.yml`:
```bash
docker-compose up -d
```

### 4. Setup Database & Prisma Client
Apply migrations and generate the Prisma Client:
```bash
pnpm prisma db push
pnpm prisma generate
```

### 5. Run the development server
Start the Next.js local server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application landing page and playground.

### 6. Test the AI Classifier
Run the built-in testing script to query the Groq LLM with a mock PR diff and view the structured JSON response:
```bash
npx tsx scripts/test-classifier.ts
```

### 7. Running the Background Worker & Queue

Launch the BullMQ worker and queue simulation scripts to process background tasks:

*   **Terminal 1 — Start the Worker:**
    ```bash
    pnpm worker
    ```

*   **Terminal 2 — Add a Test Job:**
    ```bash
    pnpm test-queue
    ```

---

## ⚡ Prisma v7 Database Adapter Architecture

This project is fully compatible with **Prisma v7**. Direct database connections in Prisma v7 require explicit **driver adapters**. We manage connections directly in Node using the standard `pg` pool wrapped in `@prisma/adapter-pg` inside [lib/prisma.ts](file:///c:/Users/hv081/OneDrive/Desktop/Code/changelog-writer/lib/prisma.ts).
