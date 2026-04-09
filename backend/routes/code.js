const express = require("express");
const router = express.Router();
const https = require("https");
const http = require("http");
const { CodeSubmission } = require("../models");
const { requireAuth } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

// Judge0 language IDs
const LANGUAGE_MAP = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

const codeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15,
  message: { error: "Too many code executions. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Simple fetch using Node built-in http/https.
 * Avoids adding an axios dependency to the backend.
 */
function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === "https:" ? https : http;
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = lib.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// POST /api/code/run  — submit code to Judge0 and return result
router.post("/run", requireAuth, codeLimiter, async (req, res, next) => {
  try {
    const { language, code, stdin = "" } = req.body;

    if (!LANGUAGE_MAP[language]) {
      return res.status(400).json({ error: "Unsupported language" });
    }
    if (!code || typeof code !== "string" || code.length > 64000) {
      return res.status(400).json({ error: "Invalid code payload" });
    }

    const JUDGE0_URL =
      process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
    const JUDGE0_KEY = process.env.JUDGE0_API_KEY;

    if (!JUDGE0_KEY) {
      return res.status(503).json({
        error:
          "Code execution service not configured. Add JUDGE0_API_KEY to backend environment.",
      });
    }

    const payload = JSON.stringify({
      language_id: LANGUAGE_MAP[language],
      source_code: Buffer.from(code).toString("base64"),
      stdin: Buffer.from(stdin).toString("base64"),
      base64_encoded: true,
      wait: true,
    });

    const result = await fetchJson(
      `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": JUDGE0_KEY,
        },
        body: payload,
      },
    );

    if (result.status !== 201 && result.status !== 200) {
      return res.status(502).json({ error: "Code execution service error" });
    }

    const j = result.data;
    const decode = (b64) => {
      if (!b64) return "";
      try {
        return Buffer.from(b64, "base64").toString("utf8");
      } catch {
        return b64;
      }
    };

    res.json({
      stdout: decode(j.stdout),
      stderr: decode(j.stderr),
      compile_output: decode(j.compile_output),
      status: j.status?.description || "Unknown",
      time: j.time,
      memory: j.memory,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/code/save  — save a code submission
router.post("/save", requireAuth, async (req, res, next) => {
  try {
    const {
      problemId,
      language,
      code,
      stdin,
      stdout,
      stderr,
      executionTime,
      memoryUsed,
      statusDescription,
    } = req.body;

    if (!LANGUAGE_MAP[language]) {
      return res.status(400).json({ error: "Unsupported language" });
    }
    if (!code || code.length > 64000) {
      return res.status(400).json({ error: "Invalid code payload" });
    }

    const submission = await CodeSubmission.create({
      userId: req.userId,
      problemId: problemId || null,
      language,
      code,
      stdin: stdin || "",
      stdout: stdout || "",
      stderr: stderr || "",
      executionTime: executionTime || null,
      memoryUsed: memoryUsed || null,
      statusDescription: statusDescription || "",
    });
    res.status(201).json(submission);
  } catch (err) {
    next(err);
  }
});

// GET /api/code/submissions  — list submissions for current user
router.get("/submissions", requireAuth, async (req, res, next) => {
  try {
    const filter = { userId: req.userId };
    if (req.query.problemId) filter.problemId = req.query.problemId;

    const submissions = await CodeSubmission.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(submissions);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
