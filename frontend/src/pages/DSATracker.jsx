import React, { useEffect, useState, useMemo } from "react";
import { dsaApi } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { Badge, Spinner, SectionHeader, EmptyState } from "../components/ui";
import {
  Code2,
  ExternalLink,
  CheckCircle2,
  Circle,
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const TOPICS = [
  "Arrays",
  "Strings",
  "Sliding Window",
  "Two Pointer",
  "Stack",
  "Queue",
  "Linked List",
  "Tree",
  "BST",
  "Heap",
  "Graph",
  "DP",
  "Greedy",
  "Backtracking",
  "Trie",
  "Union Find",
];
const DIFFS = ["Easy", "Medium", "Hard"];

const TOPIC_COLORS = {
  Arrays:
    "bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  Strings:
    "bg-purple-50 dark:bg-purple-900/25 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  "Sliding Window":
    "bg-cyan-50 dark:bg-cyan-900/25 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  "Two Pointer":
    "bg-teal-50 dark:bg-teal-900/25 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  Stack:
    "bg-orange-50 dark:bg-orange-900/25 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  Queue:
    "bg-yellow-50 dark:bg-yellow-900/25 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  "Linked List":
    "bg-pink-50 dark:bg-pink-900/25 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  Tree: "bg-lime-50 dark:bg-lime-900/25 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-800",
  BST: "bg-green-50 dark:bg-green-900/25 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  Heap: "bg-red-50 dark:bg-red-900/25 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  Graph:
    "bg-indigo-50 dark:bg-indigo-900/25 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  DP: "bg-violet-50 dark:bg-violet-900/25 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  Greedy:
    "bg-amber-50 dark:bg-amber-900/25 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  Backtracking:
    "bg-rose-50 dark:bg-rose-900/25 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  Trie: "bg-fuchsia-50 dark:bg-fuchsia-900/25 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800",
  "Union Find":
    "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600",
};

const ADMIN_EMAIL = "sunnykumary029@gmail.com";

export default function DSATracker() {
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTopic, setFilterTopic] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [collapsed, setCollapsed] = useState({});
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [noteEditing, setNoteEditing] = useState(null);
  const [noteVal, setNoteVal] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState({
    name: "",
    topic: "Arrays",
    difficulty: "Easy",
    leetcodeUrl: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    dsaApi
      .getAll()
      .then(setProblems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchTopic = filterTopic === "All" || p.topic === filterTopic;
      const matchDiff = filterDiff === "All" || p.difficulty === filterDiff;
      const matchStatus = filterStatus === "All" || p.status === filterStatus;
      return matchSearch && matchTopic && matchDiff && matchStatus;
    });
  }, [problems, search, filterTopic, filterDiff, filterStatus]);

  const grouped = useMemo(() => {
    return TOPICS.reduce((acc, topic) => {
      const items = filtered.filter((p) => p.topic === topic);
      if (items.length) acc[topic] = items;
      return acc;
    }, {});
  }, [filtered]);

  const solved = problems.filter((p) => p.status === "Done").length;
  const total = problems.length;

  async function toggleStatus(p) {
    const next = p.status === "Done" ? "Todo" : "Done";
    try {
      const updated = await dsaApi.updateStatus(p._id, next);
      setProblems((prev) => prev.map((x) => (x._id === p._id ? updated : x)));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newP.name.trim()) return;
    setAddLoading(true);
    try {
      const created = await dsaApi.create(newP);
      setProblems((prev) => [...prev, created]);
      setNewP({
        name: "",
        topic: "Arrays",
        difficulty: "Easy",
        leetcodeUrl: "",
      });
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAddLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this problem? This cannot be undone.")) return;
    try {
      await dsaApi.delete(id);
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err?.error || "Failed to delete problem. Please try again.");
      console.error(err);
    }
  }

  function toggleCollapse(topic) {
    setCollapsed((prev) => ({ ...prev, [topic]: !prev[topic] }));
  }

  const toggleExpand = (id) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  async function saveNote(id) {
    try {
      const updated = await dsaApi.updateNotes(id, noteVal);
      setProblems((prev) => prev.map((x) => (x._id === id ? updated : x)));
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
    <div className="fade-in max-w-6xl mx-auto space-y-5">
      <SectionHeader
        title="DSA Problem Tracker"
        sub={`${solved} solved out of ${total} problems`}
        action={
          isAdmin ? (
            <button
              onClick={() => setShowAdd((s) => !s)}
              className="btn-primary"
            >
              <Plus size={15} /> Add Problem
            </button>
          ) : null
        }
      />

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total",
            val: total,
            color: "text-gray-800 dark:text-gray-200",
          },
          { label: "Solved", val: solved, color: "text-emerald-600" },
          { label: "Todo", val: total - solved, color: "text-amber-600" },
        ].map(({ label, val, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Add Problem Form */}
      {isAdmin && showAdd && (
        <div className="card p-5 border border-brand-200 bg-brand-50/30">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Plus size={15} className="text-brand-600" /> Add New Problem
          </h3>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <div className="sm:col-span-2">
              <label className="label mb-1 block">Problem Name</label>
              <input
                className="input"
                placeholder="e.g. Two Sum"
                value={newP.name}
                onChange={(e) =>
                  setNewP((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="label mb-1 block">Topic</label>
              <select
                className="input"
                value={newP.topic}
                onChange={(e) =>
                  setNewP((p) => ({ ...p, topic: e.target.value }))
                }
              >
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label mb-1 block">Difficulty</label>
              <select
                className="input"
                value={newP.difficulty}
                onChange={(e) =>
                  setNewP((p) => ({ ...p, difficulty: e.target.value }))
                }
              >
                {DIFFS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label mb-1 block">
                LeetCode URL (optional)
              </label>
              <input
                className="input"
                placeholder="https://leetcode.com/problems/..."
                value={newP.leetcodeUrl}
                onChange={(e) =>
                  setNewP((p) => ({ ...p, leetcodeUrl: e.target.value }))
                }
              />
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addLoading}
                className="btn-primary"
              >
                {addLoading ? "Adding..." : "Add Problem"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="input pl-8 w-48"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input w-auto"
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
        >
          <option value="All">All Topics</option>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          className="input w-auto"
          value={filterDiff}
          onChange={(e) => setFilterDiff(e.target.value)}
        >
          <option value="All">All Difficulties</option>
          {DIFFS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          className="input w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Todo">Todo</option>
          <option value="Done">Done</option>
        </select>
        {(search ||
          filterTopic !== "All" ||
          filterDiff !== "All" ||
          filterStatus !== "All") && (
          <button
            className="btn-ghost text-xs"
            onClick={() => {
              setSearch("");
              setFilterTopic("All");
              setFilterDiff("All");
              setFilterStatus("All");
            }}
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Problem groups */}
      {Object.keys(grouped).length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No problems found"
          sub="Try adjusting your filters"
        />
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([topic, items]) => {
            const topicDone = items.filter((i) => i.status === "Done").length;
            const isOpen = !!collapsed[topic];
            const colorClass =
              TOPIC_COLORS[topic] ||
              "bg-gray-100 text-gray-700 border-gray-200";
            return (
              <div key={topic} className="card overflow-hidden">
                {/* Topic header */}
                <button
                  onClick={() => toggleCollapse(topic)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-left"
                >
                  {isOpen ? (
                    <ChevronDown
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                  )}
                  <span className={`badge border ${colorClass}`}>{topic}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {items.length} problems
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {topicDone} done
                    </span>
                    <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all"
                        style={{
                          width: `${items.length ? (topicDone / items.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </button>

                {/* Problem rows */}
                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-400 uppercase tracking-wide">
                          <th className="px-4 py-2.5 text-left font-medium w-8"></th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Problem
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium">
                            Difficulty
                          </th>
                          <th className="px-4 py-2.5 text-left font-medium hidden sm:table-cell">
                            Day
                          </th>
                          <th className="px-4 py-2.5 text-right font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                        {items.map((p) => {
                          const isExpanded = expandedIds.has(p._id);
                          const isEditingNote = noteEditing === p._id;
                          return (
                            <React.Fragment key={p._id}>
                              <tr
                                className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group ${p.status === "Done" ? "opacity-70" : ""}`}
                              >
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => toggleStatus(p)}
                                    className="flex items-center"
                                  >
                                    {p.status === "Done" ? (
                                      <CheckCircle2
                                        size={18}
                                        className="text-emerald-500"
                                      />
                                    ) : (
                                      <Circle
                                        size={18}
                                        className="text-gray-300 group-hover:text-brand-400 transition-colors"
                                      />
                                    )}
                                  </button>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`font-medium ${p.status === "Done" ? "line-through text-gray-400 dark:text-gray-600" : "text-gray-800 dark:text-gray-200"}`}
                                  >
                                    {p.name}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <Badge variant={p.difficulty}>
                                    {p.difficulty}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell text-xs text-gray-400">
                                  {p.dayNumber ? `Day ${p.dayNumber}` : "—"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    {p.leetcodeUrl && (
                                      <a
                                        href={p.leetcodeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-ghost py-1 px-2 text-xs"
                                        title="Open on LeetCode"
                                      >
                                        <ExternalLink size={13} />
                                      </a>
                                    )}
                                    <button
                                      onClick={() => toggleExpand(p._id)}
                                      className="btn-ghost py-1 px-2 text-xs"
                                      title={
                                        isExpanded ? "Hide notes" : "Notes"
                                      }
                                    >
                                      <ChevronDown
                                        size={13}
                                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                      />
                                    </button>
                                    {isAdmin && (
                                      <button
                                        onClick={() => handleDelete(p._id)}
                                        className="btn-ghost py-1 px-2 text-xs text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100"
                                        title="Delete problem"
                                        aria-label={`Delete ${p.name}`}
                                      >
                                        <X size={13} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr>
                                  <td colSpan={5} className="px-4 pb-4 pt-1">
                                    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4">
                                      <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
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
                                            placeholder="Write your notes, approach, time complexity..."
                                            autoFocus
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => saveNote(p._id)}
                                              className="btn-primary text-xs py-1.5"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={() =>
                                                setNoteEditing(null)
                                              }
                                              className="btn-ghost text-xs py-1.5"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          onClick={() => {
                                            setNoteEditing(p._id);
                                            setNoteVal(p.notes || "");
                                          }}
                                          className="min-h-[80px] text-xs text-gray-500 dark:text-gray-400 italic cursor-pointer p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700/50 border border-dashed border-gray-200 dark:border-gray-600 transition-colors leading-relaxed"
                                        >
                                          {p.notes || "Click to add notes..."}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
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
