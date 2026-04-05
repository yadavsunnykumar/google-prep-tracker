# 🎯 Google Interview Prep Tracker

A full-stack web application to track your Google Software Engineer & AI Engineer interview preparation with structured monthly plans, daily tasks, and problem tracking.

---

## 🚀 Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS |
| Backend    | Node.js + Express             |
| Database   | MongoDB + Mongoose            |
| HTTP Client| Axios                         |
| Icons      | Lucide React                  |
| Routing    | React Router v6               |

---

## 📁 Folder Structure

```
google-prep-tracker/
├── backend/
│   ├── models/
│   │   └── index.js          # All MongoDB schemas
│   ├── routes/
│   │   ├── dashboard.js      # Aggregate stats
│   │   ├── dsa.js            # DSA CRUD routes
│   │   ├── systemDesign.js   # System design routes
│   │   ├── aiTopics.js       # AI/ML routes
│   │   ├── monthlyPlan.js    # Monthly plan routes
│   │   ├── dailyTasks.js     # Daily task routes
│   │   └── progress.js       # Streak & progress
│   ├── seed/
│   │   └── seedData.js       # Auto-generates all data
│   ├── server.js             # Express entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Layout.jsx      # Sidebar + header shell
│   │   │   └── ui/
│   │   │       └── index.jsx       # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main overview
│   │   │   ├── MonthlyPlan.jsx     # Month-by-month plan
│   │   │   ├── DailyTasks.jsx      # Day selector + task form
│   │   │   ├── DSATracker.jsx      # Problem tracker
│   │   │   ├── SystemDesign.jsx    # SD question tracker
│   │   │   └── AITracker.jsx       # AI/ML topic tracker
│   │   ├── utils/
│   │   │   └── api.js              # Axios API wrapper
│   │   ├── App.jsx                 # Router setup
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🗄️ MongoDB Collections & Schemas

### `dsaproblems`
```js
{
  name:        String (required),
  topic:       Enum['Arrays','Strings','Sliding Window','Two Pointer','Stack',
                    'Queue','Linked List','Tree','BST','Heap','Graph','DP',
                    'Greedy','Backtracking','Trie','Union Find'],
  difficulty:  Enum['Easy','Medium','Hard'],
  leetcodeUrl: String,
  status:      Enum['Todo','Done'],
  notes:       String,
  dayNumber:   Number,
  timestamps:  true
}
```

### `systemdesigns`
```js
{
  name:       String (required),
  category:   String,
  status:     Enum['Todo','In Progress','Done'],
  notes:      String,
  components: [String],
  resources:  [String],
  dayNumber:  Number,
  timestamps: true
}
```

### `aitopics`
```js
{
  name:       String (required),
  category:   Enum['ML','Deep Learning','LLM','GenAI','MLOps'],
  status:     Enum['Todo','In Progress','Done'],
  notes:      String,
  resources:  [String],
  dayNumber:  Number,
  timestamps: true
}
```

### `dailytasks`
```js
{
  dayNumber:          Number (unique, required),
  date:               Date,
  dsaProblem1:        ObjectId -> DsaProblem,
  dsaProblem2:        ObjectId -> DsaProblem,
  systemDesignTopic:  ObjectId -> SystemDesign,
  aiTopic:            ObjectId -> AiTopic,
  backendTopic:       String,
  csTopic:            String,
  notes:              String,
  hoursStudied:       Number,
  isCompleted:        Boolean,
  completedAt:        Date,
  timestamps:         true
}
```

### `monthlyplans`
```js
{
  month:         Number (1-12),
  title:         String,
  subtitle:      String,
  dsaTopics:     [{ name: String, completed: Boolean }],
  sdTopics:      [{ name: String, completed: Boolean }],
  aiTopics:      [{ name: String, completed: Boolean }],
  backendTopics: [{ name: String, completed: Boolean }],
  csTopics:      [{ name: String, completed: Boolean }],
  projects:      [{ name: String, tag: String, completed: Boolean }],
  timestamps:    true
}
```

### `progresses`
```js
{
  userId:           String,
  streak:           Number,
  lastStudiedDate:  Date,
  totalDaysStudied: Number,
  dsaSolved:        Number,
  sdCompleted:      Number,
  aiCompleted:      Number,
  currentDay:       Number,
  currentMonth:     Number,
  timestamps:       true
}
```

---

## 🛣️ Backend API Routes

| Method | Route                            | Description                  |
|--------|----------------------------------|------------------------------|
| GET    | `/api/health`                    | Health check                 |
| GET    | `/api/dashboard`                 | Aggregate dashboard stats    |
| GET    | `/api/dsa`                       | All DSA problems             |
| GET    | `/api/dsa/grouped`               | Problems grouped by topic    |
| PATCH  | `/api/dsa/:id/status`            | Toggle problem status        |
| POST   | `/api/dsa`                       | Add new problem              |
| DELETE | `/api/dsa/:id`                   | Delete problem               |
| GET    | `/api/system-design`             | All SD questions             |
| PATCH  | `/api/system-design/:id/status`  | Update SD status             |
| PATCH  | `/api/system-design/:id/notes`   | Update SD notes              |
| GET    | `/api/ai-topics`                 | All AI/ML topics             |
| PATCH  | `/api/ai-topics/:id/status`      | Update AI topic status       |
| GET    | `/api/monthly-plan`              | All monthly plans            |
| GET    | `/api/monthly-plan/:month`       | Single month plan            |
| PATCH  | `/api/monthly-plan/:month/topic` | Toggle topic completion      |
| GET    | `/api/daily-tasks`               | All daily tasks              |
| GET    | `/api/daily-tasks/:day`          | Single day task              |
| PATCH  | `/api/daily-tasks/:day`          | Update day (notes, complete) |
| GET    | `/api/progress`                  | Get user progress            |
| PATCH  | `/api/progress`                  | Update progress              |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Step 1 — Clone & install

```bash
# Clone or copy the project
cd google-prep-tracker

# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
```

### Step 2 — Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
```

**.env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/google-prep-tracker
NODE_ENV=development
```

### Step 3 — Seed the database

```bash
cd backend
npm run seed
```

This generates:
- 50+ DSA problems across 16 topics
- 15 system design questions
- 20 AI/ML topics
- 33 auto-generated daily tasks
- 6-month preparation plans
- Initial streak/progress record

### Step 4 — Start the servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server: http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App: http://localhost:5173
```

### Step 5 — Open the app

Visit: **http://localhost:5173**

---

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Overview, stats, streak, today's tasks |
| Monthly Plan | `/monthly-plan` | Month selector with topic checklists |
| Daily Tasks | `/daily-tasks` | Calendar grid, task detail, study log |
| DSA Tracker | `/dsa` | Problems by topic, status toggle |
| System Design | `/system-design` | SD questions with notes |
| AI / ML | `/ai-ml` | AI topics by category with progress |

---

## 🔧 Development Notes

- Frontend proxies `/api` calls to `http://localhost:5000` via Vite config
- All data is seeded for a single user (`userId: 'default'`)
- Streak auto-updates when a day is marked complete
- Daily tasks are auto-generated linking DSA, SD, AI topics by `dayNumber`

---

## 🚀 Production Build

```bash
# Build frontend
cd frontend
npm run build

# Serve static files from backend (add to server.js):
# app.use(express.static(path.join(__dirname, '../frontend/dist')))
```

---

## 📚 Key Resources Used in This Plan

- **NeetCode 150**: https://neetcode.io/practice
- **System Design Primer**: https://github.com/donnemartin/system-design-primer
- **LeetCode Google Tag**: https://leetcode.com/company/google/
- **Hands-On ML (Géron)**: O'Reilly book — chapters 1–12
- **HuggingFace Course**: https://huggingface.co/learn
- **fast.ai**: https://www.fast.ai/
- **LangChain Docs**: https://docs.langchain.com/

---

*Built for Google SWE & AI Engineer interview preparation. Good luck! 🎯*
