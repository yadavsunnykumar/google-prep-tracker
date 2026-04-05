const router = require("express").Router();
const { Progress } = require("../models");
const { requireAuth, optionalAuth } = require("../middleware/auth");

// GET — works for authenticated users (per-user) or falls back to legacy 'default'
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const userId = req.userId || "default";
    const p = await Progress.findOne({ userId });
    res.json(p);
  } catch (err) {
    next(err);
  }
});

router.patch("/", requireAuth, async (req, res, next) => {
  try {
    // Strip non-updatable fields from body
    const { userId: _u, _id: _i, __v: _v, ...updates } = req.body;
    const p = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $set: updates },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    res.json(p);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
