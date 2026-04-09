import { useEffect, useState, useMemo } from "react";
import { skillsApi } from "../utils/api";
import { Spinner, SectionHeader } from "../components/ui";
import {
  Award,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Zap,
  RefreshCw,
} from "lucide-react";

const STATUS_OPTIONS = ["Not Started", "In Progress", "Completed"];

const STATUS_CONFIG = {
  "Not Started": {
    icon: Circle,
    pill: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
    dot: "bg-gray-300 dark:bg-gray-600",
  },
  "In Progress": {
    icon: Clock,
    pill: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-400",
  },
  Completed: {
    icon: CheckCircle2,
    pill: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
};

const IMPORTANCE_COLORS = {
  High: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  Medium: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  Low: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
};

const CATEGORY_COLORS = [
  "from-indigo-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-fuchsia-500 to-pink-600",
  "from-rose-500 to-red-600",
];

function CategoryCard({ category, skills, colorClass, onStatusChange }) {
  const [collapsed, setCollapsed] = useState(false);

  const total = skills.length;
  const completed = skills.filter(
    (s) => s.progress?.status === "Completed",
  ).length;
  const inProgress = skills.filter(
    (s) => s.progress?.status === "In Progress",
  ).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="card overflow-hidden">
      {/* Category header */}
      <div
        className={`bg-gradient-to-r ${colorClass} px-4 py-3 flex items-center justify-between cursor-pointer`}
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Award size={16} className="text-white flex-shrink-0" />
          <h3 className="text-sm font-semibold text-white truncate">
            {category}
          </h3>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-white/80">
            {completed}/{total}
          </span>
          {collapsed ? (
            <ChevronRight size={16} className="text-white/80" />
          ) : (
            <ChevronDown size={16} className="text-white/80" />
          )}
        </div>
      </div>

      {/* Progress bar */}
      {!collapsed && (
        <div className="h-1 bg-gray-100 dark:bg-gray-700">
          <div
            className={`h-1 bg-gradient-to-r ${colorClass} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Stats row */}
      {!collapsed && (
        <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <span className="text-xs text-gray-500">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {completed}
            </span>{" "}
            completed
          </span>
          <span className="text-xs text-gray-500">
            <span className="font-semibold text-amber-500">{inProgress}</span>{" "}
            in progress
          </span>
          <span className="text-xs text-gray-500">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {pct}%
            </span>{" "}
            done
          </span>
        </div>
      )}

      {/* Skills list */}
      {!collapsed && (
        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {skills.map((skill) => (
            <SkillRow
              key={skill._id}
              skill={skill}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SkillRow({ skill, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const status = skill.progress?.status || "Not Started";
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;

  return (
    <div>
      <div
        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Status dot */}
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />

        {/* Name */}
        <span
          className={`flex-1 text-sm font-medium min-w-0 ${
            status === "Completed"
              ? "line-through text-gray-400 dark:text-gray-600"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {skill.skillName}
        </span>

        {/* Importance badge */}
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium hidden sm:block ${
            IMPORTANCE_COLORS[skill.importanceLevel] || IMPORTANCE_COLORS.Medium
          }`}
        >
          {skill.importanceLevel}
        </span>

        {/* Status selector */}
        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={status}
            onChange={(e) => onStatusChange(skill._id, e.target.value)}
            className={`text-[11px] rounded-lg px-2 py-1 border-none font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${cfg.pill}`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <ChevronDown
          size={13}
          className={`text-gray-400 flex-shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-50 dark:border-gray-700/50">
          {skill.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">
              {skill.description}
            </p>
          )}
          {skill.expectedLevel && (
            <div className="flex items-start gap-1.5 mb-2">
              <Zap size={12} className="text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                <span className="font-medium">Expected: </span>
                {skill.expectedLevel}
              </p>
            </div>
          )}
          {skill.resources?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skill.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ExternalLink size={10} />
                  {r.title}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SkillsDashboard() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  async function loadSkills() {
    setLoading(true);
    try {
      const data = await skillsApi.getAll();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  async function seedSkills() {
    setSeeding(true);
    try {
      await skillsApi.seed();
      await loadSkills();
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  }

  async function handleStatusChange(skillId, newStatus) {
    try {
      const updated = await skillsApi.updateProgress(skillId, newStatus);
      setSkills((prev) =>
        prev.map((s) => (s._id === skillId ? { ...s, progress: updated } : s)),
      );
    } catch (err) {
      console.error(err);
    }
  }

  const grouped = useMemo(() => {
    const map = {};
    skills.forEach((s) => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [skills]);

  const categories = Object.keys(grouped);

  const totalSkills = skills.length;
  const completedSkills = skills.filter(
    (s) => s.progress?.status === "Completed",
  ).length;
  const inProgressSkills = skills.filter(
    (s) => s.progress?.status === "In Progress",
  ).length;
  const overallPct =
    totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={32} />
      </div>
    );

  return (
    <div className="fade-in max-w-5xl mx-auto space-y-5">
      <SectionHeader
        title="Google SDE-2 Skills Dashboard"
        sub="Track your readiness across all key skill areas"
        action={
          skills.length === 0 ? (
            <button
              onClick={seedSkills}
              disabled={seeding}
              className="btn-primary"
            >
              {seeding ? <Spinner size={14} /> : <Zap size={15} />}
              Load Skills Catalog
            </button>
          ) : (
            <button onClick={loadSkills} className="btn-ghost text-xs">
              <RefreshCw size={13} /> Refresh
            </button>
          )
        }
      />

      {skills.length === 0 ? (
        <div className="card p-12 text-center">
          <Award
            size={48}
            className="mx-auto mb-4 text-indigo-300 dark:text-indigo-700"
          />
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No skills loaded yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Load the curated SDE-2 skills catalog to start tracking your
            progress.
          </p>
          <button
            onClick={seedSkills}
            disabled={seeding}
            className="btn-primary mx-auto"
          >
            {seeding ? <Spinner size={14} /> : <Zap size={15} />}
            Load Skills Catalog
          </button>
        </div>
      ) : (
        <>
          {/* Overall stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Total Skills",
                value: totalSkills,
                color: "text-gray-700 dark:text-gray-300",
              },
              {
                label: "Completed",
                value: completedSkills,
                color: "text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "In Progress",
                value: inProgressSkills,
                color: "text-amber-500",
              },
              {
                label: "Overall",
                value: `${overallPct}%`,
                color: "text-indigo-600 dark:text-indigo-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="card p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div className="card p-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Overall Readiness</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {overallPct}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>

          {/* Category cards */}
          <div className="space-y-4">
            {categories.map((cat, idx) => (
              <CategoryCard
                key={cat}
                category={cat}
                skills={grouped[cat]}
                colorClass={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
