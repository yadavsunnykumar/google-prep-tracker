import { useEffect, useState, useCallback } from "react";
import { notesApi } from "../utils/api";
import { Spinner, SectionHeader } from "../components/ui";
import RichTextEditor from "../components/editor/RichTextEditor";
import {
  FileText,
  Plus,
  Trash2,
  Tag,
  Search,
  X,
  Save,
  BookOpen,
} from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "All Notes" },
  { value: "general", label: "General" },
  { value: "dsa", label: "DSA" },
  { value: "sd", label: "System Design" },
  { value: "ai", label: "AI / ML" },
];

const CAT_COLORS = {
  general: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
  dsa: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  sd: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  ai: "bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400",
};

function NoteCard({ note, isActive, onClick, onDelete }) {
  const preview = note.contentHtml
    ? note.contentHtml
        .replace(/<[^>]+>/g, " ")
        .trim()
        .slice(0, 120)
    : "";

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-xl border p-3 transition-all ${
        isActive
          ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-1">
          {note.title}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note._id);
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-red-500 transition-all text-gray-400"
          title="Delete note"
        >
          <Trash2 size={13} />
        </button>
      </div>
      {preview && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {preview}
        </p>
      )}
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide ${
            CAT_COLORS[note.category] || CAT_COLORS.general
          }`}
        >
          {note.category}
        </span>
        {note.tags?.slice(0, 2).map((t) => (
          <span
            key={t}
            className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Form state
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("general");
  const [editContent, setEditContent] = useState(null); // TipTap JSON
  const [editHtml, setEditHtml] = useState("");
  const [editTags, setEditTags] = useState("");
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    notesApi
      .getAll()
      .then(setNotes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeNote = notes.find((n) => n._id === activeId);

  const filtered = notes.filter((n) => {
    const matchCat = catFilter === "all" || n.category === catFilter;
    const matchSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.contentHtml || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function openNote(note) {
    setActiveId(note._id);
    setEditTitle(note.title);
    setEditCategory(note.category);
    setEditContent(note.content || null);
    setEditHtml(note.contentHtml || "");
    setEditTags((note.tags || []).join(", "));
    setIsNew(false);
    setDirty(false);
  }

  function startNew() {
    setActiveId("__new__");
    setEditTitle("Untitled Note");
    setEditCategory(catFilter !== "all" ? catFilter : "general");
    setEditContent(null);
    setEditHtml("");
    setEditTags("");
    setIsNew(true);
    setDirty(false);
  }

  const handleEditorChange = useCallback((json, html) => {
    setEditContent(json);
    setEditHtml(html);
    setDirty(true);
  }, []);

  async function save() {
    if (!editTitle.trim()) return;
    setSaving(true);
    try {
      const tags = editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 10);

      if (isNew) {
        const created = await notesApi.create({
          title: editTitle,
          category: editCategory,
          content: editContent,
          contentHtml: editHtml,
          tags,
        });
        setNotes((prev) => [created, ...prev]);
        setActiveId(created._id);
        setIsNew(false);
      } else {
        const updated = await notesApi.update(activeId, {
          title: editTitle,
          category: editCategory,
          content: editContent,
          contentHtml: editHtml,
          tags,
        });
        setNotes((prev) => prev.map((n) => (n._id === activeId ? updated : n)));
      }
      setDirty(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function deleteNote(id) {
    if (!window.confirm("Delete this note?")) return;
    try {
      await notesApi.delete(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      if (activeId === id) {
        setActiveId(null);
        setIsNew(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={32} />
      </div>
    );

  const showEditor = activeId !== null;

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <SectionHeader
        title="Notes"
        sub="Rich-text notes for DSA, System Design, AI/ML and general study"
        action={
          <button onClick={startNew} className="btn-primary">
            <Plus size={15} /> New Note
          </button>
        }
      />

      <div className="flex gap-4 mt-5 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="input pl-8 text-sm"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCatFilter(c.value)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  catFilter === c.value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Note list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-400">
                <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
                No notes yet.
                <br />
                <button
                  onClick={startNew}
                  className="text-indigo-500 hover:underline mt-1"
                >
                  Create your first note
                </button>
              </div>
            )}
            {filtered.map((n) => (
              <NoteCard
                key={n._id}
                note={n}
                isActive={activeId === n._id}
                onClick={() => openNote(n)}
                onDelete={deleteNote}
              />
            ))}
          </div>
        </div>

        {/* Editor pane */}
        <div className="flex-1 flex flex-col card overflow-hidden">
          {!showEditor ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <FileText size={48} className="mb-4 opacity-30" />
              <p className="text-sm">Select a note or create a new one</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                    setDirty(true);
                  }}
                  className="flex-1 text-base font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  placeholder="Note title..."
                />

                <select
                  value={editCategory}
                  onChange={(e) => {
                    setEditCategory(e.target.value);
                    setDirty(true);
                  }}
                  className="text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 focus:outline-none"
                >
                  {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={save}
                  disabled={saving || !dirty}
                  className={`btn-primary text-xs py-1.5 ${
                    !dirty ? "opacity-50 cursor-default" : ""
                  }`}
                >
                  {saving ? <Spinner size={14} /> : <Save size={14} />}
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-50 dark:border-gray-700/50">
                <Tag size={12} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => {
                    setEditTags(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="Tags (comma separated)..."
                  className="flex-1 text-xs bg-transparent border-none outline-none text-gray-500 dark:text-gray-400 placeholder-gray-300 dark:placeholder-gray-600"
                />
              </div>

              {/* Rich text editor */}
              <div className="flex-1 overflow-y-auto p-4">
                <RichTextEditor
                  key={activeId}
                  content={editContent}
                  onChange={handleEditorChange}
                  placeholder="Start writing your note…"
                  minHeight="100%"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
