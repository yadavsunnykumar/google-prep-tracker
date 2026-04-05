const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.error("❌ JWT_SECRET must be set in production");
  process.exit(1);
}
const JWT_SECRET =
  process.env.JWT_SECRET || "dev-jwt-secret-change-before-production";

// Required auth — rejects if no valid token
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Optional auth — sets req.userId if token present, never rejects
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    try {
      const payload = jwt.verify(header.slice(7), JWT_SECRET);
      req.userId = payload.userId;
    } catch {
      /* ignore */
    }
  }
  next();
}

module.exports = { requireAuth, optionalAuth, JWT_SECRET };
