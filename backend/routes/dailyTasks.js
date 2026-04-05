const router = require("express").Router();
const { DailyTask, Progress } = require("../models");
const { requireAuth, optionalAuth } = require("../middleware/auth");

// GET all tasks
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const tasks = await DailyTask.find({})
      .populate("dsaProblem1 dsaProblem2")
      .populate("systemDesignTopic")
      .populate("aiTopic")
      .sort({ dayNumber: 1 });
    res.json(tasks);
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
    res.json(task);
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

      // Update streak atomically using findOneAndUpdate
      if (isCompleted && !wasCompleted) {
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
          lastDate === yesterday
            ? 1
            : lastDate === today
              ? 0
              : -(progress.streak - 1);
        await Progress.updateOne(
          { userId: req.userId },
          {
            $inc: { totalDaysStudied: 1, streak: streakInc },
            $set: {
              lastStudiedDate: new Date(),
              currentDay: Math.max(progress.currentDay, day + 1),
              // Reset streak to 1 if streak was broken (streakInc is negative)
              ...(lastDate !== yesterday && lastDate !== today
                ? { streak: 1 }
                : {}),
            },
          },
        );
      }
    }
    await task.save();
    res.json(
      await task.populate("dsaProblem1 dsaProblem2 systemDesignTopic aiTopic"),
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
