const express = require("express");
const router = express.Router();
const https = require("https");
const http = require("http");
const { CodeSubmission } = require("../models");
const { requireAuth } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

// Piston runtime names + pinned versions (https://emkc.org/api/v2/piston/runtimes)
const PISTON_LANGUAGES = {
  javascript: { language: "javascript", version: "18.15.0" },
  python:     { language: "python",     version: "3.10.0"  },
  java:       { language: "java",       version: "15.0.2"  },
  cpp:        { language: "c++",        version: "10.2.0"  },
};

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

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

// POST /api/code/run  — submit code to Piston and return result
router.post("/run", requireAuth, codeLimiter, async (req, res, next) => {
  try {
    const { language, code, stdin = "" } = req.body;

    if (!PISTON_LANGUAGES[language]) {
      return res.status(400).json({ error: "Unsupported language" });
    }
    if (!code || typeof code !== "string" || code.length > 64000) {
      return res.status(400).json({ error: "Invalid code payload" });
    }

    const { language: pistonLang, version: pistonVersion } = PISTON_LANGUAGES[language];
    const payload = JSON.stringify({
      language: pistonLang,
      version: pistonVersion,
      files: [{ content: code }],
      stdin,
    });

    const result = await fetchJson(PISTON_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
      body: payload,
    });

    if (result.status !== 200) {
      return res.status(502).json({ error: "Code execution service error" });
    }

    const { run, compile } = result.data;

    // Derive a human-readable status
    let status = "Accepted";
    if (compile && compile.code !== 0) {
      status = "Compilation Error";
    } else if (run.code !== 0 || run.signal) {
      status = "Runtime Error";
    }

    res.json({
      stdout: run.stdout || "",
      stderr: run.stderr || "",
      compile_output: compile ? compile.stderr || compile.stdout || "" : "",
      status,
      time: null,
      memory: null,
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

    if (!PISTON_LANGUAGES[language]) {
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
