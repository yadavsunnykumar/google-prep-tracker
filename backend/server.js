const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// ── Validate required secrets at startup ──────────────────────
const isProd = process.env.NODE_ENV === "production";
if (isProd && !process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET environment variable is required in production");
  process.exit(1);
}
if (isProd && !process.env.SESSION_SECRET) {
  console.error(
    "❌ SESSION_SECRET environment variable is required in production",
  );
  process.exit(1);
}

const app = express();

// ── Security headers ──────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use(express.json({ limit: "1mb" })); // increased for rich text / code payloads
app.use(morgan("dev"));

// ── Session ───────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-session-secret-change-in-prod",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd,
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

// ── Passport (OAuth) ─────────────────────────────────────────
const { router: oauthRouter, passport } = require("./routes/oauth");
app.use(passport.initialize());
app.use(passport.session());

// ── Rate limiters ─────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/oauth", oauthRouter);
app.use("/api/progress", require("./routes/progress"));
app.use("/api/dsa", require("./routes/dsa"));
app.use("/api/system-design", require("./routes/systemDesign"));
app.use("/api/ai-topics", require("./routes/aiTopics"));
app.use("/api/monthly-plan", require("./routes/monthlyPlan"));
app.use("/api/daily-tasks", require("./routes/dailyTasks"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/code", require("./routes/code"));
app.use("/api/skills", require("./routes/skills"));

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date() }),
);

// ── Centralized error handler ─────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[Error]", err);
  const status = err.status || err.statusCode || 500;
  const message = isProd
    ? "Internal server error"
    : err.message || "Internal server error";
  res.status(status).json({ error: message });
});

// ── Database + server start ───────────────────────────────────
const PORT = process.env.PORT || 5002;
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/google-prep-tracker";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

module.exports = app;
