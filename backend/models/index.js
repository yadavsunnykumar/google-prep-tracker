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
    itemType: { type: String, enum: ["dsa", "sd", "ai"], required: true },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    notes: { type: String, default: "" },
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

module.exports = {
  User: mongoose.model("User", userSchema),
  UserStatus: mongoose.model("UserStatus", userStatusSchema),
  DsaProblem: mongoose.model("DsaProblem", dsaProblemSchema),
  SystemDesign: mongoose.model("SystemDesign", systemDesignSchema),
  AiTopic: mongoose.model("AiTopic", aiTopicSchema),
  DailyTask: mongoose.model("DailyTask", dailyTaskSchema),
  MonthlyPlan: mongoose.model("MonthlyPlan", monthlyPlanSchema),
  Progress: mongoose.model("Progress", progressSchema),
};
