import { useEffect, useState, useMemo } from "react";
import { systemDesignApi } from "../utils/api";
import { Spinner, SectionHeader, EmptyState } from "../components/ui";
import {
  Server,
  CheckCircle2,
  Clock,
  PlayCircle,
  Search,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

const STATUS_OPTS = ["Todo", "In Progress", "Done"];

const STATUS_CONFIG = {
  Todo: {
    icon: Clock,
    label: "Todo",
    active: "bg-slate-700 text-white border-slate-700",
    pill: "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
  },
  "In Progress": {
    icon: PlayCircle,
    label: "Doing",
    active: "bg-amber-500 text-white border-amber-500",
    pill: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  },
  Done: {
    icon: CheckCircle2,
    label: "Done",
    active: "bg-emerald-500 text-white border-emerald-500",
    pill: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
};

const CATEGORY_COLORS = {
  Infrastructure:
    "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  Web: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  Messaging:
    "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  Social:
    "bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  Media:
    "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  Location:
    "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  Search:
    "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  Storage:
    "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  Finance:
    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  Analytics:
    "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  AI: "bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800",
};

export default function SystemDesign() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
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
    systemDesignApi
      .getAll()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const matchSearch =
          !search || i.name.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "All" || i.status === filter;
        return matchSearch && matchFilter;
      }),
    [items, search, filter],
  );

  // Group by category preserving insertion order
  const grouped = useMemo(() => {
    const map = {};
    for (const item of filtered) {
      const cat = item.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    }
    return map;
  }, [filtered]);

  const done = items.filter((i) => i.status === "Done").length;
  const inProgress = items.filter((i) => i.status === "In Progress").length;

  async function handleStatus(id, status) {
    try {
      const updated = await systemDesignApi.updateStatus(id, status);
      setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
    } catch (err) {
      console.error(err);
    }
  }

  async function saveNote(id) {
    try {
      const updated = await systemDesignApi.updateNotes(id, noteVal);
      setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
      setNoteEditing(null);
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

  return (
    <div className="fade-in max-w-5xl mx-auto space-y-5">
      <SectionHeader
        title="System Design Tracker"
        sub={`${done} completed · ${inProgress} in progress · ${items.length - done - inProgress} todo`}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Total",
            val: items.length,
            color: "text-slate-800 dark:text-slate-200",
          },
          { label: "Done", val: done, color: "text-emerald-600" },
          { label: "In Progress", val: inProgress, color: "text-amber-600" },
        ].map(({ label, val, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="input pl-8 w-full sm:w-52"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {["All", ...STATUS_OPTS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filter === s
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              {s === "In Progress" ? "Doing" : s}
            </button>
          ))}
        </div>
        {(search || filter !== "All") && (
          <button
            className="btn-ghost text-xs"
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Grouped list */}
      {Object.keys(grouped).length === 0 ? (
        <EmptyState
          icon={Server}
          title="No topics found"
          sub="Try adjusting your filters"
        />
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([category, catItems]) => {
            const catDone = catItems.filter((i) => i.status === "Done").length;
            const isGroupOpen = collapsedGroups.has(category);
            const colorClass =
              CATEGORY_COLORS[category] ||
              "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600";

            return (
              <div key={category} className="card overflow-hidden">
                {/* Category header */}
                <button
                  onClick={() => toggleGroup(category)}
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
                  <span
                    className={`badge border text-[11px] px-2 py-0.5 rounded-full font-medium ${colorClass}`}
                  >
                    {category}
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {catItems.length} topics
                  </span>
                  <div className="ml-auto flex items-center gap-3">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {catDone} done
                    </span>
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all"
                        style={{
                          width: `${catItems.length ? (catDone / catItems.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </button>

                {/* Topics in category */}
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
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            {/* Status icon */}
                            <StatusIcon
                              size={16}
                              className={`flex-shrink-0 ${cfg.pill.includes("emerald") ? "text-emerald-500" : cfg.pill.includes("amber") ? "text-amber-500" : "text-slate-400"}`}
                            />

                            {/* Name + day */}
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {item.name}
                              </span>
                              <span className="text-xs text-slate-400 ml-2">
                                Day {item.dayNumber}
                              </span>
                            </div>

                            {/* Component chips (hidden on small) */}
                            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                              {item.components?.slice(0, 2).map((c) => (
                                <span
                                  key={c}
                                  className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full"
                                >
                                  {c}
                                </span>
                              ))}
                              {item.components?.length > 2 && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-full">
                                  +{item.components.length - 2}
                                </span>
                              )}
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
                                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
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
                                        placeholder="Write your notes, key insights, diagrams to remember..."
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
