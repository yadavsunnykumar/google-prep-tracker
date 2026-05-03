const router = require("express").Router();
const { DailyTask, Progress, UserStatus } = require("../models");
const { requireAuth, optionalAuth } = require("../middleware/auth");

async function attachTopicStatuses(task, userId) {
  const t = task.toObject ? task.toObject() : { ...task };
  if (!userId) return t;

  const entries = [
    t.dsaProblem1 && { obj: t.dsaProblem1, type: "dsa" },
    t.dsaProblem2 && { obj: t.dsaProblem2, type: "dsa" },
    t.systemDesignTopic && { obj: t.systemDesignTopic, type: "sd" },
    t.aiTopic && { obj: t.aiTopic, type: "ai" },
  ].filter(Boolean);

  if (!entries.length) return t;

  const ids = entries.map((e) => e.obj._id);
  const statuses = await UserStatus.find({ userId, itemId: { $in: ids } });
  const map = Object.fromEntries(statuses.map((s) => [s.itemId.toString(), s.status]));

  entries.forEach(({ obj }) => {
    obj.userStatus = map[obj._id.toString()] || "Todo";
  });

  return t;
}

// GET all tasks
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const tasks = await DailyTask.find({})
      .populate("dsaProblem1 dsaProblem2")
      .populate("systemDesignTopic")
      .populate("aiTopic")
      .sort({ dayNumber: 1 });

    if (!req.userId) return res.json(tasks);

    // Fetch all UserStatuses for this user in one query and attach to topics
    const allIds = tasks.flatMap((t) =>
      [t.dsaProblem1, t.dsaProblem2, t.systemDesignTopic, t.aiTopic]
        .filter(Boolean)
        .map((x) => x._id),
    );
    const statuses = await UserStatus.find({
      userId: req.userId,
      itemId: { $in: allIds },
    });
    const map = Object.fromEntries(statuses.map((s) => [s.itemId.toString(), s.status]));

    res.json(
      tasks.map((task) => {
        const t = task.toObject();
        ["dsaProblem1", "dsaProblem2", "systemDesignTopic", "aiTopic"].forEach((key) => {
          if (t[key]) t[key].userStatus = map[t[key]._id.toString()] || "Todo";
        });
        return t;
      }),
    );
  } catch (err) {
    next(err);
  }
});

// GET single day
router.get("/:day", optionalAuth, async (req, res, next) => {
  try {
    const day = parseInt(req.params.day, 10);
    if (isNaN(day))
      return res.status(400).json({ error: "Invalid day number" });
    const task = await DailyTask.findOne({ dayNumber: day })
      .populate("dsaProblem1 dsaProblem2")
      .populate("systemDesignTopic")
      .populate("aiTopic");
    if (!task) return res.status(404).json({ error: "Day not found" });
    res.json(await attachTopicStatuses(task, req.userId));
  } catch (err) {
    next(err);
  }
});

// PATCH update day (notes, hours, complete)
router.patch("/:day", requireAuth, async (req, res, next) => {
  try {
    const day = parseInt(req.params.day, 10);
    if (isNaN(day))
      return res.status(400).json({ error: "Invalid day number" });

    const { notes, hoursStudied, isCompleted, date } = req.body;
    const task = await DailyTask.findOne({ dayNumber: day });
    if (!task) return res.status(404).json({ error: "Day not found" });

    if (notes !== undefined) task.notes = notes;
    if (hoursStudied !== undefined)
      task.hoursStudied = Math.max(0, Number(hoursStudied) || 0);
    if (date !== undefined) task.date = date;

    if (isCompleted !== undefined) {
      const wasCompleted = task.isCompleted;
      task.isCompleted = Boolean(isCompleted);
      task.completedAt = isCompleted ? new Date() : null;

      if (isCompleted && !wasCompleted) {
        // Update streak
        const progress = await Progress.findOneAndUpdate(
          { userId: req.userId },
          {},
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
        const today = new Date().toDateString();
        const lastDate = progress.lastStudiedDate
          ? new Date(progress.lastStudiedDate).toDateString()
          : null;
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        const streakInc =
          lastDate === yesterday ? 1 : lastDate === today ? 0 : -(progress.streak - 1);

        const streakBroken = lastDate !== yesterday && lastDate !== today;
        await Progress.updateOne(
          { userId: req.userId },
          {
            $inc: {
              totalDaysStudied: 1,
              ...(streakBroken ? {} : { streak: streakInc }),
            },
            $set: {
              lastStudiedDate: new Date(),
              currentDay: Math.max(progress.currentDay, day + 1),
              ...(streakBroken ? { streak: 1 } : {}),
            },
          },
        );

        // Cascade: mark all linked topics as Done in UserStatus
        const cascadeOps = [
          task.dsaProblem1 && { itemId: task.dsaProblem1, itemType: "dsa" },
          task.dsaProblem2 && { itemId: task.dsaProblem2, itemType: "dsa" },
          task.systemDesignTopic && { itemId: task.systemDesignTopic, itemType: "sd" },
          task.aiTopic && { itemId: task.aiTopic, itemType: "ai" },
        ].filter(Boolean);

        await Promise.all(
          cascadeOps.map(({ itemId, itemType }) =>
            UserStatus.findOneAndUpdate(
              { userId: req.userId, itemId, itemType },
              { status: "Done" },
              { upsert: true, new: true },
            ),
          ),
        );
      }
    }

    await task.save();
    const populated = await task.populate(
      "dsaProblem1 dsaProblem2 systemDesignTopic aiTopic",
    );
    res.json(await attachTopicStatuses(populated, req.userId));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
