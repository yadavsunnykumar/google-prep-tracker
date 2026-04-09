const express = require("express");
const router = express.Router();
const { Skill, SkillProgress } = require("../models");
const { requireAuth, optionalAuth } = require("../middleware/auth");

// GET /api/skills  — list all skills, merge user progress if authed
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const skills = await Skill.find()
      .sort({ category: 1, orderIndex: 1 })
      .lean();

    if (req.userId) {
      const progList = await SkillProgress.find({ userId: req.userId }).lean();
      const progMap = {};
      progList.forEach((p) => {
        progMap[p.skillId.toString()] = p;
      });
      const merged = skills.map((s) => ({
        ...s,
        progress: progMap[s._id.toString()] || {
          status: "Not Started",
          notes: "",
        },
      }));
      return res.json(merged);
    }

    res.json(skills);
  } catch (err) {
    next(err);
  }
});

// GET /api/skills/summary  — per-category completion stats
router.get("/summary", requireAuth, async (req, res, next) => {
  try {
    const skills = await Skill.find().lean();
    const progList = await SkillProgress.find({ userId: req.userId }).lean();
    const progMap = {};
    progList.forEach((p) => {
      progMap[p.skillId.toString()] = p.status;
    });

    const summary = {};
    skills.forEach((s) => {
      if (!summary[s.category]) {
        summary[s.category] = {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
        };
      }
      const st = progMap[s._id.toString()] || "Not Started";
      summary[s.category].total += 1;
      if (st === "Completed") summary[s.category].completed += 1;
      else if (st === "In Progress") summary[s.category].inProgress += 1;
      else summary[s.category].notStarted += 1;
    });

    res.json(summary);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/skills/:id/progress  — update user progress for a skill
router.patch("/:id/progress", requireAuth, async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const allowed = ["Not Started", "In Progress", "Completed"];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const skill = await Skill.findById(req.params.id).lean();
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    const update = {};
    if (status !== undefined) {
      update.status = status;
      update.completedAt = status === "Completed" ? new Date() : null;
    }
    if (notes !== undefined) update.notes = notes.slice(0, 1000);

    const prog = await SkillProgress.findOneAndUpdate(
      { userId: req.userId, skillId: req.params.id },
      update,
      { upsert: true, new: true, runValidators: true },
    ).lean();
    res.json(prog);
  } catch (err) {
    next(err);
  }
});

// POST /api/skills/seed  — seed skill catalog (idempotent)
router.post("/seed", requireAuth, async (req, res, next) => {
  try {
    const existing = await Skill.countDocuments();
    if (existing > 0) {
      return res.json({ message: "Skills already seeded", count: existing });
    }

    const { seedSkills } = require("../seed/skillsSeed");
    await Skill.insertMany(seedSkills);
    const count = await Skill.countDocuments();
    res.json({ message: "Skills seeded successfully", count });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
