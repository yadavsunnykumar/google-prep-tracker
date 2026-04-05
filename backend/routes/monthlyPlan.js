const router = require("express").Router();
const { MonthlyPlan } = require("../models");
const { requireAuth } = require("../middleware/auth");

const VALID_SECTIONS = [
  "dsaTopics",
  "sdTopics",
  "aiTopics",
  "backendTopics",
  "csTopics",
  "projects",
];

router.get("/", async (req, res, next) => {
  try {
    const plans = await MonthlyPlan.find({}).sort({ month: 1 });
    res.json(plans);
  } catch (err) {
    next(err);
  }
});

router.get("/:month", async (req, res, next) => {
  try {
    const plan = await MonthlyPlan.findOne({
      month: parseInt(req.params.month, 10),
    });
    if (!plan) return res.status(404).json({ error: "Month not found" });
    res.json(plan);
  } catch (err) {
    next(err);
  }
});

// Toggle topic completion inside a month
router.patch("/:month/topic", requireAuth, async (req, res, next) => {
  try {
    const { section, index, completed } = req.body;
    if (!VALID_SECTIONS.includes(section)) {
      return res.status(400).json({ error: "Invalid section" });
    }
    const idx = parseInt(index, 10);
    if (isNaN(idx) || idx < 0) {
      return res.status(400).json({ error: "Invalid index" });
    }
    const plan = await MonthlyPlan.findOne({
      month: parseInt(req.params.month, 10),
    });
    if (!plan) return res.status(404).json({ error: "Month not found" });
    if (plan[section]?.[idx] !== undefined) {
      plan[section][idx].completed = Boolean(completed);
      await plan.save();
    }
    res.json(plan);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
