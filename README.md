# AI Changelog Writer

An automated, AI-powered developer tool designed to ingest GitHub Pull Requests, classify their technical impact, and auto-generate beautifully structured, user-facing changelog entries. Built with Next.js, React, Tailwind CSS v4, Prisma, Groq SDK, and BullMQ.

---

## Key Features

*   **AI-Powered Classification**: Translates complex Git/GitHub PR diffs, titles, and descriptions into clean, present-tense, user-facing summaries.
*   **Multi-category Taxonomy**: Smart classification of changes into `FEATURE`, `BUGFIX`, `BREAKING`, and `INTERNAL` categories.
*   **Semantic Versioning Recommendations**: Suggests version bumps (`major`, `minor`, `patch`) based on the nature of the parsed changes.
*   **Background Job Queue**: Uses Redis & BullMQ to asynchronously process webhooks, run AI generation jobs, and ensure reliable execution.
*   **Database Integration**: Leverages PostgreSQL and Prisma to track GitHub installations, repositories, generated entries, and granular change logs.
*   **Rich Text Editor**: Equipped with Tiptap Editor (`@tiptap/react`) to allow developers to refine and publish generated changelog drafts manually.
*   **Authentication Ready**: NextAuth.js is pre-configured to easily manage logins and connect GitHub accounts.

---

## Technology Stack

| Technology | Purpose | Key Package(s) |
| :--- | :--- | :--- |
| **Core Framework** | React 19 & Next.js 16 (App Router) | `next`, `react`, `react-dom` |
| **Styling & UI** | Tailwind CSS v4 & Lucide Icons | `tailwindcss`, `lucide-react`, `class-variance-authority` |
| **Database ORM** | PostgreSQL Database | `@prisma/client`, `prisma` |
| **AI Processing** | Groq Cloud LLM Integration | `groq-sdk` (running `llama-3.3-70b-versatile`) |
| **Background Tasks** | Redis-backed Job Processing Queue | `bullmq`, `ioredis` |
| **Editor** | Rich Text WYSIWYG Editing | `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm` |
| **Authentication** | Secure OAuth Login | `next-auth` |

---

## Directory Structure

The project has a modular, scalable folder layout:

```text
changelog-writer/
├── app/                      # Next.js App Router (Pages, Layouts, global CSS)
│   ├── generated/            # Automatically generated Prisma client
│   │   └── prisma/
│   ├── globals.css           # Global Tailwind CSS imports and variable tokens
│   ├── layout.tsx            # Main HTML wrapper & font configuration
│   └── page.tsx              # Application home page
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
├── docker-compose.yml        # Multi-container setup for local Postgres & Redis
├── package.json              # Project scripts and dependencies
└── tsconfig.json             # TypeScript compiler settings
```

---

## Database Schema (`prisma/schema.prisma`)

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
*   **`ChangelogEntry`**: Captures a single changelog release, raw diffs (`rawDiff`), AI-generated drafts (`aiDraft`), and publication details.
*   **`Change`**: Detailed change items mapped to a specific entry, classifying files and impact.
*   **`ChangeType`**: Enum with `FEATURE`, `BUGFIX`, `BREAKING`, and `INTERNAL`.
*   **`EntryStatus`**: Enum with `DRAFT`, `PUBLISHED`, and `ARCHIVED`.

---

## LLM Classification Flow (`lib/llm/classifier.ts`)

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

## Environment Variables Config (`.env`)

Create a `.env` file in the root directory and configure the following parameters:

```env
# Database Connection (Postgres)
DATABASE_URL="postgresql://postgres:dev@localhost:5432/changelog"

# Redis Queue Connection
REDIS_URL="redis://localhost:6379"

# Groq Cloud API Key
GROQ_API_KEY="your-groq-api-key-here"
```

---

## Local Setup & Development

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
Apply migrations and generate the Prisma Client in `app/generated/prisma`:
```bash
pnpm prisma db push
pnpm prisma generate
```

### 5. Run the development server
Start the Next.js local server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 6. Test the AI Classifier
Run the built-in testing script to query the Groq LLM with a mock PR diff and view the structured JSON response:
```bash
npx tsx scripts/test-classifier.ts
```

### 7. Running the Background Worker & Queue

Now that the local database and Redis services are active, you can start the BullMQ worker and queue a test job using simple, integrated scripts:

#### Method A: Using `pnpm` (Recommended)
*   **Terminal 1 — Start the Worker:**
    ```bash
    pnpm worker
    ```
    *You should see:* `[worker] Starting changelog worker...`

*   **Terminal 2 — Add a Test Job:**
    ```bash
    pnpm test-queue
    ```
    *You should see:* `Job added: pr-42`

Once the job is queued, watch Terminal 1. The worker will pick it up, run AI classification, save the entry, and output:
```text
[worker] Processing job pr-42 — testuser/my-app PR#42
[worker] Classified: "Dark mode toggle and sidebar contrast fix" (minor)
[worker] Saved draft entry: clxxxxxxxxxxxxx
[worker] ✓ Job pr-42 completed
```

#### Method B: Using standard `npm run` or `npx`
*   **Terminal 1 — Start the Worker:**
    ```bash
    npm run worker
    # OR
    npx worker
    ```

*   **Terminal 2 — Add a Test Job:**
    ```bash
    npm run test-queue
    # OR
    npx test-queue
    ```

---

## Prisma v7 Database Adapter Architecture

This project is fully compatible with **Prisma v7**. Direct database connections in Prisma v7 require explicit **driver adapters**.

We manage connections directly in Node using the standard `pg` pool wrapped in `@prisma/adapter-pg` inside [lib/prisma.ts](file:///c:/Users/hv081/OneDrive/Desktop/Code/changelog-writer/lib/prisma.ts):

```typescript
import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  log: ["query", "error"],
  adapter,
});
```

