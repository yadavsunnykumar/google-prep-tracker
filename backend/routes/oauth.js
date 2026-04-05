const router = require("express").Router();
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET } = require("../middleware/auth");

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:5173";

// ── Helper: find-or-create user from OAuth profile ────────────
async function findOrCreateOAuthUser(provider, profile) {
  const email = profile.emails?.[0]?.value || "";

  // If user already exists with this email, return them
  if (email) {
    const existingByEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingByEmail) return existingByEmail;
  }

  // Derive username from email (part before @), fallback to display name
  let baseUsername = "";
  if (email) {
    baseUsername = email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .slice(0, 28);
  }
  if (!baseUsername || baseUsername.length < 3) {
    baseUsername = (
      profile.displayName ||
      profile.username ||
      `${provider}_${profile.id}`
    )
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 28);
  }
  if (baseUsername.length < 3) baseUsername = baseUsername.padEnd(3, "_");

  let username = baseUsername;
  let counter = 1;
  while (await User.findOne({ username })) {
    username = `${baseUsername.slice(0, 27)}_${counter}`;
    counter++;
  }

  const user = await User.create({
    username,
    email: email ? email.toLowerCase() : "",
    password: `oauth_${provider}_${profile.id}`,
  });
  return user;
}

// ── GitHub Strategy ───────────────────────────────────────────
if (process.env.GITHUB_CLIENT_ID) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL || "http://localhost:5000"}/api/oauth/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser("github", profile);
          done(null, user);
        } catch (err) {
          done(err);
        }
      },
    ),
  );
}

// ── Google Strategy ───────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL || "http://localhost:5000"}/api/oauth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser("google", profile);
          done(null, user);
        } catch (err) {
          done(err);
        }
      },
    ),
  );
}

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    done(null, await User.findById(id));
  } catch (err) {
    done(err);
  }
});

// ── Routes ────────────────────────────────────────────────────
// Check if OAuth is configured
router.get("/status", (req, res) => {
  res.json({
    github: !!process.env.GITHUB_CLIENT_ID,
    google: !!process.env.GOOGLE_CLIENT_ID,
  });
});

// GitHub
router.get("/github", (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID) {
    return res.redirect(`${FRONTEND}/login?error=github_not_configured`);
  }
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${FRONTEND}/login?error=github_failed`,
  }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.redirect(`${FRONTEND}/auth/callback?token=${token}`);
  },
);

// Google
router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.redirect(`${FRONTEND}/login?error=google_not_configured`);
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next,
  );
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${FRONTEND}/login?error=google_failed`,
  }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.redirect(`${FRONTEND}/auth/callback?token=${token}`);
  },
);

module.exports = { router, passport };
