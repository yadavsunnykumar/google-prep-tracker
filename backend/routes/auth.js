const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET, requireAuth } = require("../middleware/auth");

const USERNAME_RE = /^[a-z0-9_]{3,32}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ error: "A valid email is required" });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = await User.findOne({ email: normalizedEmail });
    if (emailExists)
      return res.status(409).json({ error: "Email already registered" });

    // Derive username from email (part before @)
    let baseUsername = normalizedEmail
      .split("@")[0]
      .replace(/[^a-z0-9_]/g, "_")
      .slice(0, 28);
    if (baseUsername.length < 3) baseUsername = baseUsername.padEnd(3, "_");

    let username = baseUsername;
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername.slice(0, 27)}_${counter}`;
      counter++;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashed,
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile — update username
router.put("/profile", requireAuth, async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }
    const cleaned = username.trim().toLowerCase();
    if (!USERNAME_RE.test(cleaned)) {
      return res.status(400).json({
        error:
          "Username must be 3-32 characters: letters, numbers, underscores only",
      });
    }

    const existing = await User.findOne({
      username: cleaned,
      _id: { $ne: req.userId },
    });
    if (existing) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { username: cleaned },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
