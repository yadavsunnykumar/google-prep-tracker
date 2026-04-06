import { useEffect, useState } from "react";
import { dailyTasksApi } from "../utils/api";
import { Badge, Spinner, SectionHeader } from "../components/ui";
import {
  Code2,
  Server,
  Brain,
  Database,
  BookOpen,
  CheckCircle2,
  Clock,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
} from "lucide-react";

export default function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState(1);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ notes: "", hoursStudied: 0 });

  useEffect(() => {
    dailyTasksApi
      .getAll()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!tasks.length) return;
    const t = tasks.find((t) => t.dayNumber === selected);
    setTask(t || null);
    setForm({ notes: t?.notes || "", hoursStudied: t?.hoursStudied || 0 });
  }, [selected, tasks]);

  async function handleComplete() {
    if (!task) return;
    setSaving(true);
    try {
      const updated = await dailyTasksApi.update(selected, {
        ...form,
        isCompleted: !task.isCompleted,
        date: new Date().toISOString(),
      });
      setTasks((prev) =>
        prev.map((t) => (t.dayNumber === selected ? updated : t)),
      );
      setTask(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!task) return;
    setSaving(true);
    try {
      const updated = await dailyTasksApi.update(selected, form);
      setTasks((prev) =>
        prev.map((t) => (t.dayNumber === selected ? updated : t)),
      );
      setTask(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const maxDay = tasks.length || 33;

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={32} />
      </div>
    );

  return (
    <div className="fade-in max-w-6xl mx-auto space-y-6">
      <SectionHeader
        title="Daily Tasks"
        sub={`${completedCount} of ${tasks.length} days completed`}
      />

      {/* Day calendar grid */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Select a Day
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block"></span>{" "}
              Done
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-brand-200 inline-block"></span>{" "}
              Selected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-gray-200 inline-block"></span>{" "}
              Pending
            </span>
          </div>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-12 gap-1.5">
          {Array.from({ length: maxDay }, (_, i) => i + 1).map((day) => {
            const t = tasks.find((t) => t.dayNumber === day);
            const isDone = t?.isCompleted;
            const isSelected = selected === day;
            return (
              <button
                key={day}
                onClick={() => setSelected(day)}
                className={`
                  w-9 h-9 rounded-lg text-xs font-semibold transition-all flex items-center justify-center
                  ${
                    isDone
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                      : isSelected
                        ? "bg-brand-600 text-white shadow-md scale-105"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-brand-100 hover:text-brand-700 border border-transparent hover:border-brand-200 dark:hover:bg-brand-900/30 dark:hover:text-brand-400"
                  }
                `}
                title={`Day ${day}${isDone ? " ✓" : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {task ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Task panels */}
          <div className="lg:col-span-2 space-y-4">
            {/* Day header */}
            <div className="card p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Day {task.dayNumber}
                  </h2>
                  {task.isCompleted && (
                    <span className="badge badge-done flex items-center gap-1">
                      <CheckCircle2 size={11} /> Completed
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {task.date
                    ? new Date(task.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not yet started"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelected((s) => Math.max(1, s - 1))}
                  className="btn-ghost py-1.5 px-2"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => setSelected((s) => Math.min(maxDay, s + 1))}
                  className="btn-ghost py-1.5 px-2"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* DSA Problems */}
            <div className="card p-4 border border-brand-100 dark:border-brand-900/50">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-100 dark:border-brand-900/50">
                <Code2 size={16} className="text-brand-600" />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  DSA Problems
                </h3>
                <span className="badge badge-todo ml-auto">2 problems</span>
              </div>
              <div className="space-y-3">
                {[task.dsaProblem1, task.dsaProblem2]
                  .filter(Boolean)
                  .map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {p.topic}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={p.difficulty}>{p.difficulty}</Badge>
                        {p.leetcodeUrl && (
                          <a
                            href={p.leetcodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-500 hover:text-brand-700 transition-colors"
                            title="Open on LeetCode"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* System Design */}
            {task.systemDesignTopic && (
              <div className="card p-4 border border-emerald-100 dark:border-emerald-900/50">
                <div className="flex items-center gap-2 mb-3">
                  <Server size={16} className="text-emerald-600" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    System Design
                  </h3>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {task.systemDesignTopic.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {task.systemDesignTopic.category}
                  </p>
                  {task.systemDesignTopic.components?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {task.systemDesignTopic.components.map((c) => (
                        <span
                          key={c}
                          className="text-[11px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI + CS + Backend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {task.aiTopic && (
                <div className="card p-4 border border-violet-100 dark:border-violet-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={14} className="text-violet-600" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      AI / ML
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {task.aiTopic.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {task.aiTopic.category}
                  </p>
                </div>
              )}
              <div className="card p-4 border border-amber-100 dark:border-amber-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-amber-600" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    CS Fundamentals
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {task.csTopic || "—"}
                </p>
              </div>
              <div className="card p-4 border border-gray-300 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Database size={14} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Backend
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {task.backendTopic || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: form */}
          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <StickyNote size={16} className="text-brand-500" />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Study Log
                </h3>
              </div>

              {/* Hours */}
              <div className="mb-4">
                <label className="label mb-1.5 block">Hours Studied</label>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-gray-400" />
                  <input
                    type="number"
                    min={0}
                    max={12}
                    step={0.5}
                    className="input w-24"
                    value={form.hoursStudied}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, hoursStudied: +e.target.value }))
                    }
                  />
                  <span className="text-sm text-gray-400">hrs</span>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="label mb-1.5 block">
                  Notes & Reflections
                </label>
                <textarea
                  className="input resize-none h-28 font-sans"
                  placeholder="What did you learn? Any blockers? Key insights..."
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-ghost w-full justify-center mb-2"
              >
                {saving ? "Saving..." : "Save Notes"}
              </button>

              <button
                onClick={handleComplete}
                disabled={saving}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                  task.isCompleted
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    : "bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                }`}
              >
                {task.isCompleted ? (
                  <>
                    <CheckCircle2 size={16} /> Mark Incomplete
                  </>
                ) : (
                  <>
                    <Flame size={16} /> Mark Day Complete
                  </>
                )}
              </button>
            </div>

            {/* Quick stats */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Progress
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Days Done
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {completedCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Remaining
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {tasks.length - completedCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Current Day
                  </span>
                  <span className="font-semibold text-brand-600">
                    #{selected}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-10 text-center">
          <p className="text-gray-400">No task found for Day {selected}</p>
        </div>
      )}
    </div>
  );
}
