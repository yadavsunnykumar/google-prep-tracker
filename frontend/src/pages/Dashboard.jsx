import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  Server,
  Brain,
  Flame,
  Trophy,
  Calendar,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Clock,
  BarChart3,
  Target,
  ListChecks,
} from "lucide-react";
import { dashboardApi } from "../utils/api";
import { StatCard, ProgressBar, Badge, Spinner } from "../components/ui";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">
          Could not load dashboard. Is the backend running?
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Run:{" "}
          <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
            cd backend && npm run dev
          </code>
        </p>
      </div>
    );

  const { stats, streak, currentDay, todayTask, recentActivity, totalStudied } =
    data;

  return (
    <div className="fade-in max-w-6xl mx-auto space-y-6">
      {/* Welcome banner */}
      <div className="card p-6 bg-gradient-to-r from-brand-600 to-violet-600 border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-brand-100 text-sm font-medium mb-1">
              Welcome back 👋
            </p>
            <h2 className="text-2xl font-bold mb-1">Google Interview Prep</h2>
            <p className="text-brand-200 text-sm">
              Day <strong className="text-white">{currentDay}</strong> of your
              preparation journey
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <Flame size={28} className="text-orange-300 mb-1" />
            <span className="text-2xl font-bold">{streak}</span>
            <span className="text-xs text-brand-200">day streak</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="DSA Solved"
          value={`${stats.dsa.done}/${stats.dsa.total}`}
          sub={`${stats.dsa.pct}% complete`}
          icon={Code2}
          color="brand"
          progress={stats.dsa.pct}
        />
        <StatCard
          label="System Design"
          value={`${stats.systemDesign.done}/${stats.systemDesign.total}`}
          sub={`${stats.systemDesign.pct}% complete`}
          icon={Server}
          color="emerald"
          progress={stats.systemDesign.pct}
        />
        <StatCard
          label="AI / ML Topics"
          value={`${stats.aiMl.done}/${stats.aiMl.total}`}
          sub={`${stats.aiMl.pct}% complete`}
          icon={Brain}
          color="violet"
          progress={stats.aiMl.pct}
        />
        <StatCard
          label="Days Studied"
          value={`${stats.daily.done}/${stats.daily.total}`}
          sub={`${totalStudied} total sessions`}
          icon={Calendar}
          color="amber"
          progress={stats.daily.pct}
        />
      </div>

      {/* Today's task + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's task */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Target size={18} className="text-brand-500" />
              Day {currentDay} — Today's Tasks
            </h3>
            <button
              onClick={() => navigate("/daily-tasks")}
              className="btn-ghost text-xs"
            >
              View all <ArrowRight size={13} />
            </button>
          </div>

          {todayTask ? (
            <div className="space-y-3">
              {/* DSA */}
              <div className="p-3.5 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 size={14} className="text-brand-600" />
                  <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">
                    DSA Problems
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[todayTask.dsaProblem1, todayTask.dsaProblem2]
                    .filter(Boolean)
                    .map((p) => (
                      <div
                        key={p._id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {p.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant={p.difficulty}>{p.difficulty}</Badge>
                          {p.leetcodeUrl && (
                            <a
                              href={p.leetcodeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-brand-500 hover:underline"
                            >
                              LC ↗
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* System Design */}
              {todayTask.systemDesignTopic && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Server
                      size={14}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      System Design
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {todayTask.systemDesignTopic.name}
                  </p>
                </div>
              )}

              {/* AI/ML */}
              {todayTask.aiTopic && (
                <div className="p-3.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain
                      size={14}
                      className="text-violet-600 dark:text-violet-400"
                    />
                    <span className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                      AI / ML
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {todayTask.aiTopic.name}
                  </p>
                </div>
              )}

              {/* CS + Backend */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                  <div className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
                    CS Fundamentals
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {todayTask.csTopic}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Backend
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {todayTask.backendTopic}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/daily-tasks")}
                className="btn-primary w-full justify-center mt-2"
              >
                <CheckCircle2 size={16} /> Mark Tasks Complete
              </button>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <Trophy size={32} className="mx-auto mb-2 text-amber-400" />
              <p className="font-medium text-gray-600">All caught up! 🎉</p>
              <p className="text-xs mt-1">No pending tasks today</p>
            </div>
          )}
        </div>

        {/* Progress + Recent */}
        <div className="space-y-4">
          {/* Overall progress */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-4">
              <BarChart3 size={17} className="text-brand-500" />
              Overall Progress
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "DSA Problems",
                  pct: stats.dsa.pct,
                  color: "bg-brand-500",
                },
                {
                  label: "System Design",
                  pct: stats.systemDesign.pct,
                  color: "bg-emerald-500",
                },
                {
                  label: "AI / ML",
                  pct: stats.aiMl.pct,
                  color: "bg-violet-500",
                },
                {
                  label: "Daily Tasks",
                  pct: stats.daily.pct,
                  color: "bg-amber-500",
                },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                    <span>{label}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {pct}%
                    </span>
                  </div>
                  <ProgressBar value={pct} color={color} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mb-3">
              <Clock size={17} className="text-brand-500" />
              Recent Activity
            </h3>
            {recentActivity && recentActivity.length > 0 ? (
              <ul className="space-y-2.5">
                {recentActivity.map((task) => (
                  <li key={task._id} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Day {task.dayNumber} completed
                      </p>
                      <p className="text-xs text-gray-400">
                        {task.completedAt
                          ? new Date(task.completedAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">
                Complete your first day to see activity
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "DSA Tracker",
            icon: Code2,
            to: "/dsa",
            color: "hover:border-brand-300",
          },
          {
            label: "System Design",
            icon: Server,
            to: "/system-design",
            color: "hover:border-emerald-300",
          },
          {
            label: "AI / ML Topics",
            icon: Brain,
            to: "/ai-ml",
            color: "hover:border-violet-300",
          },
          {
            label: "Monthly Plan",
            icon: Calendar,
            to: "/monthly-plan",
            color: "hover:border-amber-300",
          },
          {
            label: "Daily Tasks",
            icon: ListChecks,
            to: "/daily-tasks",
            color: "hover:border-rose-300",
          },
          {
            label: "Study Log",
            icon: BookOpen,
            to: "/daily-tasks",
            color: "hover:border-gray-300",
          },
        ].map(({ label, icon: Icon, to, color }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className={`card p-4 flex items-center gap-3 text-left hover:shadow-md transition-all border ${color} group`}
          >
            <Icon
              size={18}
              className="text-gray-400 group-hover:text-brand-500 transition-colors"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
            <ArrowRight
              size={14}
              className="ml-auto text-gray-300 group-hover:text-brand-400 transition-colors"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
