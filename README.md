# HabitFlow — Production-Grade Habit Tracking Platform

**Author:** Venkatesh (Software Engineer)  
**System Class:** Distributed Behavioral Habit Engine  
**Live Demo:** [https://habitflow-lovat.vercel.app/](https://habitflow-lovat.vercel.app/)

---

## 1. Product Vision: The Habit Loop Optimization

HabitFlow is engineered around the core principles of behavioral psychology (specifically the Cue-Craving-Response-Reward loop outlined in James Clear's *Atomic Habits*). 

Traditional habit tracking systems fail because they introduce operational friction (slow sync times, timezone shifts, complex input forms) which disrupt this loop. HabitFlow optimizes this by:
- **Reducing Friction (Response)**: Lightweight stateless API endpoints, single-tap logs toggles, and zero-latency UI updates.
- **Positive Reinforcement (Reward)**: Premium, interactive dark-theme UI with micro-animations, active flame streak counters, and category-specific styling that serves as instant visual reward validation.
- **Progress Visibility (Cue)**: Color-graded completion calendars and graphs acting as permanent cues to keep users on track.

---

## 2. Core Architecture & Tech Stack Selection

To ensure rapid developer velocity, minimal bundle sizes, and seamless operational scales, the system employs a decoupled SPA-and-API architecture.

### The Tech Stack
- **Frontend SPA**: **React 19** + **Vite**. React manages declarative component structures. Vite provides instant hot-module replacements and optimized Rolldown production bundles.
- **Design & Styling**: **Vanilla CSS (Custom Properties)**. We rejected heavy Tailwind and CSS-in-JS dependencies. Instead, a clean, variable-based theme engine (`theme.css` + `index.css`) handles HSL configurations, glassmorphic layout tokens, and native color changes.
- **Backend Service**: **Node.js** + **Express**. Simple, highly scalable, asynchronous event-loop architecture managing stateless REST request flows.
- **Database Engine**: **MongoDB** + **Mongoose**. MongoDB’s document model maps perfectly to logging collections. Mongoose coordinates validation rules.
- **Developer Experience (Zero-Config DB)**: **mongodb-memory-server**. For local testing, the backend dynamically spins up a sandboxed in-memory database if no external database URI is defined, allowing instant project execution out-of-the-box.

---

## 3. Directory Layout & Module Boundaries

The code is strictly separated into client-side asset compilation boundaries and server-side model-controller-routing interfaces:

```
Habitflow/
│
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable stateless UI modules
│   │   │   ├── Navbar.jsx      # Sticky navbar with mobile-drawer and theme controls
│   │   │   ├── HabitCard.jsx   # List item displaying streaks, tags, and complete check
│   │   │   ├── HabitModal.jsx  # Habit creator and color preset selector
│   │   │   ├── ProgressRing.jsx# Custom SVG daily completion indicator
│   │   │   ├── CalendarWidget.jsx # Monthly logs visualizer grid with inspect drawer
│   │   │   └── AnalyticsCharts.jsx # Responsive custom SVG line/bar chart canvas
│   │   ├── pages/              # Routing panels (Landing, Auth, Dashboard, Profile, Settings)
│   │   ├── services/           # HTTP API client with auth interceptor (api.js)
│   │   ├── styles/             # Stylesheets (theme.css variables, index.css global layout)
│   │   └── utils/              # Client constants and converters
│   └── index.html              # HTML shell & SEO metadata
│
├── server/                     # Express REST Monolith
│   ├── config/                 # DB connector with automatic in-memory fallback
│   ├── controllers/            # Stateless handlers (req/res cycle logic)
│   ├── middleware/             # JWT validator middleware
│   ├── models/                 # Mongoose validation schemas (User, Habit, HabitLog)
│   ├── routes/                 # Express route declarations
│   ├── utils/                  # Deterministic algorithms (Streak calculations)
│   └── server.js               # Express server entry point
│
├── shared/                     # Shared configurations and data structure rules
└── package.json                # Project-wide dependencies and orchestration scripts
```

---

## 4. Key Engineering Implementations

### A. Timezone-Safe Streak Engine
Timezone and Daylight Saving Time (DST) changes commonly corrupt streaks. If dates are stored as UTC timestamps, a completion at 11:30 PM local time could be saved as the next day in UTC, breaking the streak.

We solved this by storing logs using a **local ISO date-string format (`YYYY-MM-DD`)**. To calculate streaks without date-parsing anomalies, we map these strings to integer **Days Since Epoch** in UTC:

$$\text{Days Since Epoch} = \text{round}\left( \frac{\text{Date.parse}(\text{"YYYY-MM-DD"})}{1000 \times 60 \times 60 \times 24} \right)$$

#### Streak Algorithm (`server/utils/streak.js`):
1. Convert unique log date-strings to epoch-day integers and sort them ascending: $O(N \log N)$ complexity.
2. Traverse the sorted integers to find the longest sequence of consecutive days (difference of exactly $1$). Any difference greater than $1$ represents a missed day, resetting the counter.
3. Compare the user's current local date and yesterday's local date. If either is present in the user's completed set, trace backwards to determine the current streak. If both are missing, the streak resets to $0$.

### B. Custom SVG Trend Visualization
Instead of importing a heavy charting library, we write coordinate offsets directly to an SVG canvas. This is robust, performs better, and will not break during future React version updates.

We map weekly completion percentages ($0\% - 100\%$) into an SVG viewbox of $500 \times 160$ pixels:

$$x = \text{padding} + \left( \frac{i \times (\text{width} - 2 \times \text{padding})}{\text{total\_intervals}} \right)$$

$$y = \text{height} - \text{padding} - \left( \frac{\text{completion\_rate}}{100} \times (\text{height} - 2 \times \text{padding}) \right)$$

This is rendered using a single `<path>` element for the line, and an closed `<path>` filled with a `linearGradient` to create a smooth, modern area chart.

---

## 5. REST API Specifications

All endpoints are prefixed with `/api` and require a `Authorization: Bearer <token>` header for private routes.

### Auth Endpoints (`/api/auth`)
- `POST /register`: Registers a user, hashes their password, and issues a JWT token.
- `POST /login`: Validates credentials and returns a JWT token.
- `GET /profile`: Private. Decodes session details from the token.

### Habits Endpoints (`/api/habits`)
- `GET /`: Private. Lists all habits created by the user.
- `POST /`: Private. Creates a new habit configuration.
- `PUT /:id`: Private. Modifies habit details (category, custom HSL color, icon).
- `DELETE /:id`: Private. Cascade deletes the habit configuration and its log history.

### Habit Logs Endpoints (`/api/logs`)
- `GET /`: Private. Retrieves log histories. Filterable by `habitId` or `date`.
- `POST /`: Private. Logs a daily habit check-in.
- `DELETE /:id`: Private. Removes a check-in (undoes completion).

### Statistics & Dashboards (`/api/dashboard` & `/api/statistics`)
- `GET /dashboard`: Private. Returns daily aggregates (completion rate, counts, active streaks) and list of enriched habits.
- `GET /statistics`: Private. Computes weekly trend lines, category distribution aggregates, and monthly data grids.

---

## 6. Setup & Developer Verification

Ensure you have **Node.js (v18+)** installed.

1. **Bootstrap Dependencies**:
   Installs both root, server, and client package trees concurrently:
   ```bash
   npm run install-all
   ```

2. **Launch Dev Servers**:
   Starts Express API backend and Vite client bundler concurrently:
   ```bash
   npm run dev
   ```
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

3. **Verify Production Compilation**:
   Generates optimized assets inside the `client/dist` directory:
   ```bash
   npm run build
   ```

---

## 7. Scale & Performance Roadmap

To scale HabitFlow to support millions of active users, the architecture will follow this roadmap:

```
[Stateless Express Instances]
            │
            ├──► Read requests (80%) ──► [Redis Cache] 
            │                               │ (Cache hit)
            │                               ▼
            └──► Write requests (20%) ─► [MongoDB Master] ──► [Shards by UserID]
```

1. **Caching Read Operations**: Approximately 80% of habit app interactions are reads (fetching the dashboard and statistics). We will place a **Redis Cache** in front of the `/api/dashboard` and `/api/statistics` endpoints. Completing a habit invalidates the cached key; otherwise, the database is never queried.
2. **Database Query Indexing**: Ensure all query keys (`createdBy` inside habits, `habitId` + `date` compound indexes inside logs) are indexed to prevent database collection scans.
3. **Log Collection Sharding**: As completion histories scale, we will shard the MongoDB collections horizontally using a hashed sharding key based on `userId` to distribute data load across server nodes.
4. **Decoupled Calculations**: Migrate heavy statistics generation and notification push queues out of the Express thread loop into dedicated background workers consuming logs asynchronously from an **Apache Kafka** event stream.
