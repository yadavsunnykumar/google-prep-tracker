const express = require("express");
const router = express.Router();
const { Note } = require("../models");
const { requireAuth } = require("../middleware/auth");

// GET /api/notes  — list notes for current user
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const filter = { userId: req.userId };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.itemId) filter.itemId = req.query.itemId;

    const notes = await Note.find(filter).sort({ updatedAt: -1 }).lean();
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// GET /api/notes/:id  — get single note
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).lean();
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// POST /api/notes  — create note
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { title, category, itemId, content, contentHtml, tags } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const note = await Note.create({
      userId: req.userId,
      title: title.trim().slice(0, 200),
      category: category || "general",
      itemId: itemId || null,
      content: content || null,
      contentHtml: contentHtml || "",
      tags: Array.isArray(tags) ? tags.slice(0, 10) : [],
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// PUT /api/notes/:id  — update note
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { title, category, content, contentHtml, tags } = req.body;
    const update = {};
    if (title !== undefined) update.title = title.trim().slice(0, 200);
    if (category !== undefined) update.category = category;
    if (content !== undefined) update.content = content;
    if (contentHtml !== undefined) update.contentHtml = contentHtml;
    if (tags !== undefined)
      update.tags = Array.isArray(tags) ? tags.slice(0, 10) : [];

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      update,
      { new: true, runValidators: true },
    ).lean();
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/notes/:id  — delete note
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
