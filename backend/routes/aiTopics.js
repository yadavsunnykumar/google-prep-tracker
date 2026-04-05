const router = require("express").Router();
const { AiTopic, UserStatus } = require("../models");
const { optionalAuth, requireAuth } = require("../middleware/auth");

// Merge per-user statuses onto base items
async function withUserStatuses(items, userId) {
  if (!userId) return items;
  const ids = items.map((i) => i._id);
  const statuses = await UserStatus.find({
    userId,
    itemId: { $in: ids },
    itemType: "ai",
  });
  const map = Object.fromEntries(statuses.map((s) => [s.itemId.toString(), s]));
  return items.map((item) => {
    const us = map[item._id.toString()];
    return us
      ? { ...item.toObject(), status: us.status, notes: us.notes }
      : item.toObject();
  });
}

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const items = await AiTopic.find(filter).sort({ dayNumber: 1 });
    res.json(await withUserStatuses(items, req.userId));
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    await UserStatus.findOneAndUpdate(
      { userId: req.userId, itemId: req.params.id, itemType: "ai" },
      { status: req.body.status },
      { upsert: true, new: true },
    );
    const base = await AiTopic.findById(req.params.id);
    if (!base) return res.status(404).json({ error: "Item not found" });
    const us = await UserStatus.findOne({
      userId: req.userId,
      itemId: req.params.id,
      itemType: "ai",
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
      { userId: req.userId, itemId: req.params.id, itemType: "ai" },
      { notes: req.body.notes },
      { upsert: true, new: true },
    );
    const base = await AiTopic.findById(req.params.id);
    if (!base) return res.status(404).json({ error: "Item not found" });
    const us = await UserStatus.findOne({
      userId: req.userId,
      itemId: req.params.id,
      itemType: "ai",
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

module.exports = router;
