const router = require("express").Router();
const { TopicItem, UserStatus } = require("../models");
const { optionalAuth, requireAuth } = require("../middleware/auth");

async function withUserStatuses(items, tracker, userId) {
  if (!userId) return items;
  const ids = items.map((i) => i._id);
  const statuses = await UserStatus.find({ userId, itemId: { $in: ids }, itemType: tracker });
  const map = Object.fromEntries(statuses.map((s) => [s.itemId.toString(), s]));
  return items.map((item) => {
    const us = map[item._id.toString()];
    return us ? { ...item.toObject(), status: us.status, notes: us.notes } : item.toObject();
  });
}

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const { tracker, category } = req.query;
    const filter = {};
    if (tracker) filter.tracker = tracker;
    if (category) filter.category = category;
    const items = await TopicItem.find(filter).sort({ dayNumber: 1 });
    res.json(await withUserStatuses(items, tracker || "react", req.userId));
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    const base = await TopicItem.findById(req.params.id);
    if (!base) return res.status(404).json({ error: "Item not found" });
    const us = await UserStatus.findOneAndUpdate(
      { userId: req.userId, itemId: req.params.id, itemType: base.tracker },
      { status: req.body.status },
      { upsert: true, new: true },
    );
    res.json({ ...base.toObject(), status: us.status, notes: us.notes });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/notes", requireAuth, async (req, res, next) => {
  try {
    const base = await TopicItem.findById(req.params.id);
    if (!base) return res.status(404).json({ error: "Item not found" });
    const us = await UserStatus.findOneAndUpdate(
      { userId: req.userId, itemId: req.params.id, itemType: base.tracker },
      { notes: req.body.notes },
      { upsert: true, new: true },
    );
    res.json({ ...base.toObject(), status: us?.status || base.status, notes: us?.notes || "" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
