import { useEffect, useState, useMemo } from "react";
import { aiApi } from "../utils/api";
import {
  Spinner,
  SectionHeader,
  EmptyState,
  ProgressBar,
} from "../components/ui";
import {
  Brain,
  CheckCircle2,
  Clock,
  PlayCircle,
  Search,
  ChevronDown,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";

const CATEGORIES = ["ML", "Deep Learning", "LLM", "GenAI", "MLOps"];

const CAT_COLORS = {
  ML: {
    bg: "bg-blue-50 dark:bg-blue-900/25",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-400",
    badge:
      "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  "Deep Learning": {
    bg: "bg-violet-50 dark:bg-violet-900/25",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800",
    dot: "bg-violet-400",
    badge:
      "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  },
  LLM: {
    bg: "bg-purple-50 dark:bg-purple-900/25",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    dot: "bg-purple-400",
    badge:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  },
  GenAI: {
    bg: "bg-pink-50 dark:bg-pink-900/25",
    text: "text-pink-700 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800",
    dot: "bg-pink-400",
    badge:
      "bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  },
  MLOps: {
    bg: "bg-amber-50 dark:bg-amber-900/25",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-400",
    badge:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
};

const STATUS_CONFIG = {
  Todo: {
    icon: Clock,
    active: "bg-slate-700 text-white border-slate-700",
    label: "Todo",
  },
  "In Progress": {
    icon: PlayCircle,
    active: "bg-amber-500 text-white border-amber-500",
    label: "Doing",
  },
  Done: {
    icon: CheckCircle2,
    active: "bg-emerald-500 text-white border-emerald-500",
    label: "Done",
  },
};

const STATUS_OPTS = ["Todo", "In Progress", "Done"];

export default function AITracker() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [noteEditing, setNoteEditing] = useState(null);
  const [noteVal, setNoteVal] = useState("");

  const toggleExpand = (id) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleGroup = (cat) =>
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  useEffect(() => {
    aiApi
      .getAll()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleStatus(id, status) {
    try {
      const updated = await aiApi.updateStatus(id, status);
      setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
    } catch (err) {
      console.error(err);
    }
  }

  async function saveNote(id) {
    try {
      const updated = await aiApi.updateNotes(id, noteVal);
      setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
      setNoteEditing(null);
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const matchSearch =
          !search || i.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === "All" || i.category === filterCat;
        const matchStatus = filterStatus === "All" || i.status === filterStatus;
        return matchSearch && matchCat && matchStatus;
      }),
    [items, search, filterCat, filterStatus],
  );

  const grouped = useMemo(
    () =>
      CATEGORIES.reduce((acc, cat) => {
        const catItems = filtered.filter((i) => i.category === cat);
        if (catItems.length) acc[cat] = catItems;
        return acc;
      }, {}),
    [filtered],
  );

  const done = items.filter((i) => i.status === "Done").length;
  const inProg = items.filter((i) => i.status === "In Progress").length;
  const total = items.length;

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={32} />
      </div>
    );

  return (
    <div className="fade-in max-w-5xl mx-auto space-y-5">
      <SectionHeader
        title="AI / ML Tracker"
        sub={`${done} mastered · ${inProg} in progress · ${total} total topics`}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Topics",
            val: total,
            color: "text-slate-800 dark:text-slate-200",
          },
          { label: "Mastered", val: done, color: "text-emerald-600" },
          { label: "In Progress", val: inProg, color: "text-amber-600" },
          {
            label: "Completion",
            val: `${total ? Math.round((done / total) * 100) : 0}%`,
            color: "text-brand-600",
          },
        ].map(({ label, val, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Category progress bars */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Progress by Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const catItems = items.filter((i) => i.category === cat);
            const catDone = catItems.filter((i) => i.status === "Done").length;
            const pct = catItems.length
              ? Math.round((catDone / catItems.length) * 100)
              : 0;
            const c = CAT_COLORS[cat] || CAT_COLORS["ML"];
            return (
              <div
                key={cat}
                className={`p-3 rounded-xl ${c.bg} border ${c.border}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span className={`text-xs font-semibold ${c.text}`}>
                    {cat}
                  </span>
                </div>
                <p className={`text-xl font-bold ${c.text} mb-1`}>{pct}%</p>
                <ProgressBar value={pct} color={c.dot} height="h-1" />
                <p className="text-xs text-slate-400 mt-1">
                  {catDone}/{catItems.length}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="input pl-8 w-52"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filterCat === c
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-brand-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {["All", ...STATUS_OPTS].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filterStatus === s
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-violet-300"
              }`}
            >
              {s === "In Progress" ? "Doing" : s}
            </button>
          ))}
        </div>
        {(search || filterCat !== "All" || filterStatus !== "All") && (
          <button
            className="btn-ghost text-xs"
            onClick={() => {
              setSearch("");
              setFilterCat("All");
              setFilterStatus("All");
            }}
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Grouped accordion list */}
      {Object.keys(grouped).length === 0 ? (
        <EmptyState
          icon={Brain}
          title="No topics found"
          sub="Adjust your filters"
        />
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([cat, catItems]) => {
            const c = CAT_COLORS[cat] || CAT_COLORS["ML"];
            const catDone = catItems.filter((i) => i.status === "Done").length;
            const isGroupOpen = collapsedGroups.has(cat);

            return (
              <div key={cat} className="card overflow-hidden">
                {/* Category header */}
                <button
                  onClick={() => toggleGroup(cat)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors text-left"
                >
                  {isGroupOpen ? (
                    <ChevronDown
                      size={16}
                      className="text-slate-400 flex-shrink-0"
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="text-slate-400 flex-shrink-0"
                    />
                  )}
                  <Sparkles size={13} className={`flex-shrink-0 ${c.text}`} />
                  <span
                    className={`badge border text-[11px] px-2 py-0.5 rounded-full font-medium ${c.badge}`}
                  >
                    {cat}
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {catItems.length} topics
                  </span>
                  <div className="ml-auto flex items-center gap-3">
                    <span className={`text-xs font-medium ${c.text}`}>
                      {catDone} done
                    </span>
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${c.dot}`}
                        style={{
                          width: `${catItems.length ? (catDone / catItems.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </button>

                {/* Topics in this category */}
                {isGroupOpen && (
                  <div className="border-t border-slate-100 dark:border-slate-700 divide-y divide-slate-50 dark:divide-slate-700/50">
                    {catItems.map((item) => {
                      const cfg =
                        STATUS_CONFIG[item.status] || STATUS_CONFIG["Todo"];
                      const StatusIcon = cfg.icon;
                      const isExpanded = expandedIds.has(item._id);
                      const isEditingNote = noteEditing === item._id;

                      return (
                        <div key={item._id} className="group">
                          {/* Topic row */}
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            {/* Status icon */}
                            <StatusIcon
                              size={16}
                              className={`flex-shrink-0 ${
                                item.status === "Done"
                                  ? "text-emerald-500"
                                  : item.status === "In Progress"
                                    ? "text-amber-500"
                                    : "text-slate-400"
                              }`}
                            />

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                              <span
                                className={`text-sm font-medium ${
                                  item.status === "Done"
                                    ? "line-through text-slate-400 dark:text-slate-600"
                                    : "text-slate-800 dark:text-slate-200"
                                }`}
                              >
                                {item.name}
                              </span>
                              <span className="text-xs text-slate-400 ml-2">
                                Day {item.dayNumber}
                              </span>
                            </div>

                            {/* Status buttons */}
                            <div className="flex gap-1 flex-shrink-0">
                              {STATUS_OPTS.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatus(item._id, s)}
                                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all border ${
                                    item.status === s
                                      ? STATUS_CONFIG[s].active
                                      : "bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                                  }`}
                                >
                                  {STATUS_CONFIG[s].label}
                                </button>
                              ))}
                            </div>

                            {/* Expand toggle */}
                            <button
                              onClick={() => toggleExpand(item._id)}
                              className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
                              title={
                                isExpanded ? "Collapse" : "Study topics & notes"
                              }
                            >
                              <ChevronDown
                                size={15}
                                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          </div>

                          {/* Expanded: subtopics + notes */}
                          {isExpanded && (
                            <div className="mx-4 mb-4 mt-1 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 overflow-hidden">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                {/* Subtopics */}
                                {item.subtopics?.length > 0 && (
                                  <div className="p-4">
                                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                      Topics to Study
                                    </p>
                                    <ul className="space-y-2">
                                      {item.subtopics.map((sub, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-start gap-2"
                                        >
                                          <span
                                            className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`}
                                          />
                                          <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                                            {sub}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Notes */}
                                <div className="p-4">
                                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                    My Notes
                                  </p>
                                  {isEditingNote ? (
                                    <div>
                                      <textarea
                                        className="input resize-none h-28 text-xs mb-2 w-full"
                                        value={noteVal}
                                        onChange={(e) =>
                                          setNoteVal(e.target.value)
                                        }
                                        placeholder="Write your notes, key insights, concepts to remember..."
                                        autoFocus
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => saveNote(item._id)}
                                          className="btn-primary text-xs py-1.5"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setNoteEditing(null)}
                                          className="btn-ghost text-xs py-1.5"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        setNoteEditing(item._id);
                                        setNoteVal(item.notes || "");
                                      }}
                                      className="min-h-[80px] text-xs text-slate-500 dark:text-slate-400 italic cursor-pointer p-3 rounded-lg hover:bg-white dark:hover:bg-slate-700/50 border border-dashed border-slate-200 dark:border-slate-600 transition-colors leading-relaxed"
                                    >
                                      {item.notes || "Click to add notes..."}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
