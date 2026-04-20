const mongoose = require("mongoose");

// ─── User ─────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

// ─── UserStatus (per-user item progress) ─────────────────────
const userStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ["dsa", "sd", "ai", "react", "devops", "cloud"], required: true },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    notes: { type: mongoose.Schema.Types.Mixed, default: "" },
  },
  { timestamps: true },
);
userStatusSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

// ─── DSA Problem ──────────────────────────────────────────────
const dsaProblemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    topic: {
      type: String,
      required: true,
      enum: [
        "Arrays",
        "Strings",
        "Sliding Window",
        "Two Pointer",
        "Stack",
        "Queue",
        "Linked List",
        "Tree",
        "BST",
        "Heap",
        "Graph",
        "DP",
        "Greedy",
        "Backtracking",
        "Trie",
        "Union Find",
      ],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    leetcodeUrl: { type: String, default: "" },
    status: { type: String, enum: ["Todo", "Done"], default: "Todo" },
    notes: { type: String, default: "" },
    dayNumber: { type: Number, default: null },
  },
  { timestamps: true },
);

// ─── System Design ────────────────────────────────────────────
const systemDesignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "General" },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    notes: { type: String, default: "" },
    components: [{ type: String }],
    subtopics: [{ type: String }],
    resources: [{ type: String }],
    dayNumber: { type: Number, default: null },
  },
  { timestamps: true },
);

// ─── AI/ML Topic ──────────────────────────────────────────────
const aiTopicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "ML" },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    notes: { type: String, default: "" },
    subtopics: [{ type: String }],
    resources: [{ type: String }],
    dayNumber: { type: Number, default: null },
  },
  { timestamps: true },
);

// ─── Daily Task ───────────────────────────────────────────────
const dailyTaskSchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true, unique: true },
    date: { type: Date, default: null },
    dsaProblem1: { type: mongoose.Schema.Types.ObjectId, ref: "DsaProblem" },
    dsaProblem2: { type: mongoose.Schema.Types.ObjectId, ref: "DsaProblem" },
    systemDesignTopic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SystemDesign",
    },
    aiTopic: { type: mongoose.Schema.Types.ObjectId, ref: "AiTopic" },
    backendTopic: { type: String, default: "" },
    csTopic: { type: String, default: "" },
    notes: { type: String, default: "" },
    hoursStudied: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// ─── Monthly Plan Topic ───────────────────────────────────────
const monthlyPlanSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    dsaTopics: [{ name: String, completed: { type: Boolean, default: false } }],
    sdTopics: [{ name: String, completed: { type: Boolean, default: false } }],
    aiTopics: [{ name: String, completed: { type: Boolean, default: false } }],
    backendTopics: [
      { name: String, completed: { type: Boolean, default: false } },
    ],
    csTopics: [{ name: String, completed: { type: Boolean, default: false } }],
    projects: [
      {
        name: String,
        tag: String,
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

// ─── Progress / Streak ────────────────────────────────────────
const progressSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "default" },
    streak: { type: Number, default: 0 },
    lastStudiedDate: { type: Date, default: null },
    totalDaysStudied: { type: Number, default: 0 },
    dsaSolved: { type: Number, default: 0 },
    sdCompleted: { type: Number, default: 0 },
    aiCompleted: { type: Number, default: 0 },
    currentDay: { type: Number, default: 1 },
    currentMonth: { type: Number, default: 1 },
  },
  { timestamps: true },
);

// ─── Note (standalone rich-text notes) ───────────────────────
const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: {
      type: String,
      enum: ["dsa", "sd", "ai", "general"],
      default: "general",
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, default: null },
    content: { type: mongoose.Schema.Types.Mixed, default: null }, // TipTap JSON
    contentHtml: { type: String, default: "" }, // rendered HTML for search
    tags: [{ type: String, trim: true, maxlength: 50 }],
  },
  { timestamps: true },
);
noteSchema.index({ userId: 1, category: 1 });

// ─── Code Submission ──────────────────────────────────────────
const codeSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: { type: mongoose.Schema.Types.ObjectId, default: null },
    language: {
      type: String,
      enum: ["javascript", "python", "java", "cpp"],
      required: true,
    },
    code: { type: String, required: true, maxlength: 64000 },
    stdin: { type: String, default: "" },
    stdout: { type: String, default: "" },
    stderr: { type: String, default: "" },
    executionTime: { type: Number, default: null }, // ms
    memoryUsed: { type: Number, default: null }, // KB
    statusDescription: { type: String, default: "" },
  },
  { timestamps: true },
);
codeSubmissionSchema.index({ userId: 1, problemId: 1 });

// ─── Topic Item (React / DevOps / Cloud) ─────────────────────
const topicItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "" },
    tracker: { type: String, enum: ["react", "devops", "cloud"], required: true },
    status: { type: String, enum: ["Todo", "In Progress", "Done"], default: "Todo" },
    notes: { type: mongoose.Schema.Types.Mixed, default: "" },
    subtopics: [{ type: String }],
    resources: [{ type: String }],
    dayNumber: { type: Number, default: null },
  },
  { timestamps: true },
);

// ─── Skill ────────────────────────────────────────────────────
const skillSchema = new mongoose.Schema(
  {
    skillName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Data Structures & Algorithms",
        "System Design",
        "Behavioral & Leadership",
        "Languages & Frameworks",
        "Machine Learning & AI",
        "Core CS Fundamentals",
      ],
    },
    description: { type: String, default: "" },
    importanceLevel: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    expectedLevel: { type: String, default: "" },
    resources: [{ title: String, url: String }],
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// ─── Skill Progress (per-user) ────────────────────────────────
const skillProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    notes: { type: String, default: "", maxlength: 1000 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
skillProgressSchema.index({ userId: 1, skillId: 1 }, { unique: true });

module.exports = {
  User: mongoose.model("User", userSchema),
  UserStatus: mongoose.model("UserStatus", userStatusSchema),
  DsaProblem: mongoose.model("DsaProblem", dsaProblemSchema),
  SystemDesign: mongoose.model("SystemDesign", systemDesignSchema),
  AiTopic: mongoose.model("AiTopic", aiTopicSchema),
  DailyTask: mongoose.model("DailyTask", dailyTaskSchema),
  MonthlyPlan: mongoose.model("MonthlyPlan", monthlyPlanSchema),
  Progress: mongoose.model("Progress", progressSchema),
  Note: mongoose.model("Note", noteSchema),
  CodeSubmission: mongoose.model("CodeSubmission", codeSubmissionSchema),
  Skill: mongoose.model("Skill", skillSchema),
  SkillProgress: mongoose.model("SkillProgress", skillProgressSchema),
  TopicItem: mongoose.model("TopicItem", topicItemSchema),
};
