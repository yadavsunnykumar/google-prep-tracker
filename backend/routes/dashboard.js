const router = require("express").Router();
const {
  DsaProblem,
  SystemDesign,
  AiTopic,
  DailyTask,
  Progress,
  UserStatus,
} = require("../models");
const { optionalAuth } = require("../middleware/auth");

// GET /api/dashboard
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const userId = req.userId || "default";

    const [
      totalDsa,
      totalSd,
      totalAi,
      totalDays,
      completedDays,
      progress,
      todayTask,
      recentActivity,
      doneDsa,
      doneSd,
      doneAi,
    ] = await Promise.all([
      DsaProblem.countDocuments(),
      SystemDesign.countDocuments(),
      AiTopic.countDocuments(),
      DailyTask.countDocuments(),
      DailyTask.countDocuments({ isCompleted: true }),
      Progress.findOne({ userId }),
      DailyTask.findOne({ isCompleted: false })
        .sort({ dayNumber: 1 })
        .populate("dsaProblem1 dsaProblem2")
        .populate("systemDesignTopic")
        .populate("aiTopic"),
      DailyTask.find({ isCompleted: true }).sort({ completedAt: -1 }).limit(5),
      // Per-user done counts via UserStatus when authenticated
      req.userId
        ? UserStatus.countDocuments({
            userId: req.userId,
            itemType: "dsa",
            status: "Done",
          })
        : DsaProblem.countDocuments({ status: "Done" }),
      req.userId
        ? UserStatus.countDocuments({
            userId: req.userId,
            itemType: "sd",
            status: "Done",
          })
        : SystemDesign.countDocuments({ status: "Done" }),
      req.userId
        ? UserStatus.countDocuments({
            userId: req.userId,
            itemType: "ai",
            status: "Done",
          })
        : AiTopic.countDocuments({ status: "Done" }),
    ]);

    const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

    res.json({
      stats: {
        dsa: { total: totalDsa, done: doneDsa, pct: pct(doneDsa, totalDsa) },
        systemDesign: {
          total: totalSd,
          done: doneSd,
          pct: pct(doneSd, totalSd),
        },
        aiMl: { total: totalAi, done: doneAi, pct: pct(doneAi, totalAi) },
        daily: {
          total: totalDays,
          done: completedDays,
          pct: pct(completedDays, totalDays),
        },
      },
      streak: progress?.streak || 0,
      currentDay: progress?.currentDay || 1,
      currentMonth: progress?.currentMonth || 1,
      totalStudied: progress?.totalDaysStudied || 0,
      todayTask,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
