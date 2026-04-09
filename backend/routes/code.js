const express = require("express");
const router = express.Router();
const https = require("https");
const http = require("http");
const { CodeSubmission } = require("../models");
const { requireAuth } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

// Wandbox compiler pattern matchers (our language key → regex to find best compiler)
const WANDBOX_PATTERNS = {
  javascript: { re: /^nodejs-\d/, options: "" },
  python: { re: /^cpython-\d/, options: "" },
  java: { re: /^openjdk-\d/, options: "" },
  cpp: { re: /^gcc-\d/, options: "-std=c++17" },
};

const WANDBOX_BASE = "https://wandbox.org/api";

// Compiler cache — populated lazily on first /run request
let wandboxCompilerCache = null;

async function getWandboxCompiler(language) {
  if (!wandboxCompilerCache) {
    const result = await fetchJson(`${WANDBOX_BASE}/list.json`, {
      method: "GET",
      headers: {},
    });
    if (result.status !== 200 || !Array.isArray(result.data)) {
      throw new Error("Could not fetch Wandbox compiler list");
    }
    wandboxCompilerCache = result.data;
  }
  const { re } = WANDBOX_PATTERNS[language];
  const matches = wandboxCompilerCache
    .map((c) => c.name)
    .filter((name) => re.test(name) && !name.includes("head"))
    .sort();
  return matches[matches.length - 1] || null; // latest stable version
}

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

// POST /api/code/run  — submit code to Wandbox and return result
router.post("/run", requireAuth, codeLimiter, async (req, res, next) => {
  try {
    const { language, code, stdin = "" } = req.body;

    if (!WANDBOX_PATTERNS[language]) {
      return res.status(400).json({ error: "Unsupported language" });
    }
    if (!code || typeof code !== "string" || code.length > 64000) {
      return res.status(400).json({ error: "Invalid code payload" });
    }

    const compiler = await getWandboxCompiler(language);
    if (!compiler) {
      return res
        .status(503)
        .json({ error: `No compiler available for ${language}` });
    }

    const payload = JSON.stringify({
      compiler,
      code,
      stdin,
      "compiler-option-raw": WANDBOX_PATTERNS[language].options,
    });

    const result = await fetchJson(`${WANDBOX_BASE}/compile.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
      body: payload,
    });

    if (result.status !== 200) {
      const detail =
        typeof result.data === "object"
          ? result.data?.error || JSON.stringify(result.data)
          : result.data;
      return res
        .status(502)
        .json({ error: `Code execution failed: ${detail}` });
    }

    const d = result.data;
    const compileError = d.compiler_error || d.compiler_output || "";
    const exitCode = parseInt(d.status ?? "0", 10);

    let status = "Accepted";
    if (compileError) status = "Compilation Error";
    else if (exitCode !== 0) status = "Runtime Error";

    res.json({
      stdout: d.program_output || "",
      stderr: d.program_error || "",
      compile_output: compileError,
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

    if (!WANDBOX_PATTERNS[language]) {
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
