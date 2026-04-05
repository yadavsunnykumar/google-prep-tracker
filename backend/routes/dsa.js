const router = require("express").Router();
const { DsaProblem, UserStatus } = require("../models");
const { optionalAuth, requireAuth } = require("../middleware/auth");

async function withUserStatuses(items, userId) {
  if (!userId) return items;
  const ids = items.map((i) => i._id);
  const statuses = await UserStatus.find({
    userId,
    itemId: { $in: ids },
    itemType: "dsa",
  });
  const map = Object.fromEntries(statuses.map((s) => [s.itemId.toString(), s]));
  return items.map((item) => {
    const us = map[item._id.toString()];
    return us
      ? { ...item.toObject(), status: us.status, notes: us.notes }
      : item.toObject();
  });
}

// GET all problems
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.topic) filter.topic = req.query.topic;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    const problems = await DsaProblem.find(filter).sort({
      topic: 1,
      difficulty: 1,
    });
    res.json(await withUserStatuses(problems, req.userId));
  } catch (err) {
    next(err);
  }
});

// GET grouped by topic
router.get("/grouped", optionalAuth, async (req, res, next) => {
  try {
    const problems = await DsaProblem.find({}).sort({ topic: 1 });
    const merged = await withUserStatuses(problems, req.userId);
    const grouped = merged.reduce((acc, p) => {
      if (!acc[p.topic]) acc[p.topic] = [];
      acc[p.topic].push(p);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    next(err);
  }
});

// PATCH status (per-user)
router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    await UserStatus.findOneAndUpdate(
      { userId: req.userId, itemId: req.params.id, itemType: "dsa" },
      { status: req.body.status },
      { upsert: true, new: true },
    );
    const base = await DsaProblem.findById(req.params.id);
    if (!base) return res.status(404).json({ error: "Problem not found" });
    const us = await UserStatus.findOne({
      userId: req.userId,
      itemId: req.params.id,
      itemType: "dsa",
    });
    res.json({ ...base.toObject(), status: us.status, notes: us.notes });
  } catch (err) {
    next(err);
  }
});

// PATCH notes (per-user)
router.patch("/:id/notes", requireAuth, async (req, res, next) => {
  try {
    await UserStatus.findOneAndUpdate(
      { userId: req.userId, itemId: req.params.id, itemType: "dsa" },
      { notes: req.body.notes },
      { upsert: true, new: true },
    );
    const base = await DsaProblem.findById(req.params.id);
    if (!base) return res.status(404).json({ error: "Problem not found" });
    const us = await UserStatus.findOne({
      userId: req.userId,
      itemId: req.params.id,
      itemType: "dsa",
    });
    res.json({
      ...base.toObject(),
      status: us?.status || base.status,
      notes: us?.notes || "",
    });
  } catch (err) {
    next(err);
  }
});

// POST add problem
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { name, topic, difficulty, leetcodeUrl } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Problem name is required" });
    }
    const problem = await DsaProblem.create({
      name: name.trim(),
      topic,
      difficulty,
      leetcodeUrl,
    });
    res.status(201).json(problem);
  } catch (err) {
    next(err);
  }
});

// DELETE problem
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await DsaProblem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Problem not found" });
    // Clean up user statuses for this problem
    await UserStatus.deleteMany({ itemId: req.params.id, itemType: "dsa" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
