const router = require("express").Router();
const { SystemDesign, UserStatus } = require("../models");
const { optionalAuth, requireAuth } = require("../middleware/auth");

async function withUserStatuses(items, userId) {
  if (!userId) return items;
  const ids = items.map((i) => i._id);
  const statuses = await UserStatus.find({
    userId,
    itemId: { $in: ids },
    itemType: "sd",
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
    const items = await SystemDesign.find({}).sort({ dayNumber: 1 });
    res.json(await withUserStatuses(items, req.userId));
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    await UserStatus.findOneAndUpdate(
      { userId: req.userId, itemId: req.params.id, itemType: "sd" },
      { status: req.body.status },
      { upsert: true, new: true },
    );
    const base = await SystemDesign.findById(req.params.id);
    if (!base) return res.status(404).json({ error: "Item not found" });
    const us = await UserStatus.findOne({
      userId: req.userId,
      itemId: req.params.id,
      itemType: "sd",
    });
    res.json({ ...base.toObject(), status: us.status, notes: us.notes });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/notes", requireAuth, async (req, res, next) => {
  try {
    await UserStatus.findOneAndUpdate(
      { userId: req.userId, itemId: req.params.id, itemType: "sd" },
      { notes: req.body.notes },
      { upsert: true, new: true },
    );
    const base = await SystemDesign.findById(req.params.id);
    if (!base) return res.status(404).json({ error: "Item not found" });
    const us = await UserStatus.findOne({
      userId: req.userId,
      itemId: req.params.id,
      itemType: "sd",
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
