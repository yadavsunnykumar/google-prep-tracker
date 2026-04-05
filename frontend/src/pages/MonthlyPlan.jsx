import { useEffect, useState } from "react";
import { monthlyPlanApi } from "../utils/api";
import {
  ProgressBar,
  Spinner,
  TopicChecklist,
  SectionHeader,
  EmptyState,
} from "../components/ui";
import {
  Calendar,
  Code2,
  Server,
  Brain,
  Database,
  Cpu,
  FolderGit2,
  CheckCircle2,
} from "lucide-react";

const MONTH_LABELS = [
  "Foundation",
  "Graphs + System Design",
  "Deep Learning + DSA",
  "Generative AI + LLM",
  "Mock Interviews + Projects",
  "Final Sprint + Apply",
];

const SECTIONS = [
  {
    key: "dsaTopics",
    label: "DSA Topics",
    icon: Code2,
    color: "text-brand-600",
    bg: "bg-brand-50",
    border: "border-brand-100",
  },
  {
    key: "sdTopics",
    label: "System Design",
    icon: Server,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    key: "aiTopics",
    label: "AI / ML Topics",
    icon: Brain,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    key: "backendTopics",
    label: "Backend Topics",
    icon: Database,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    key: "csTopics",
    label: "CS Fundamentals",
    icon: Cpu,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    key: "projects",
    label: "Projects to Build",
    icon: FolderGit2,
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
];

export default function MonthlyPlan() {
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    monthlyPlanApi
      .getAll()
      .then(setPlans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const plan = plans.find((p) => p.month === selected);

  function calcPct(plan) {
    if (!plan) return 0;
    const allItems = [
      ...(plan.dsaTopics || []),
      ...(plan.sdTopics || []),
      ...(plan.aiTopics || []),
      ...(plan.backendTopics || []),
      ...(plan.csTopics || []),
      ...(plan.projects || []),
    ];
    if (!allItems.length) return 0;
    return Math.round(
      (allItems.filter((i) => i.completed).length / allItems.length) * 100,
    );
  }

  async function handleToggle(section, index, completed) {
    try {
      const updated = await monthlyPlanApi.toggleTopic(
        selected,
        section,
        index,
        completed,
      );
      setPlans((prev) => prev.map((p) => (p.month === selected ? updated : p)));
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
    <div className="fade-in max-w-6xl mx-auto space-y-6">
      <SectionHeader
        title="Monthly Preparation Plan"
        sub="Track your progress month by month across all topics"
      />

      {/* Month selector */}
      <div className="card p-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {(plans.length > 0
            ? plans
            : Array.from({ length: 6 }, (_, i) => ({ month: i + 1 }))
          ).map((p) => {
            const pct = calcPct(p);
            const isActive = selected === p.month;
            return (
              <button
                key={p.month}
                onClick={() => setSelected(p.month)}
                className={`relative p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? "border-brand-400 bg-brand-50 shadow-sm"
                    : "border-gray-200 hover:border-brand-200 hover:bg-brand-50/50"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar
                    size={12}
                    className={isActive ? "text-brand-600" : "text-gray-400"}
                  />
                  <span
                    className={`text-xs font-semibold ${isActive ? "text-brand-700" : "text-gray-500"}`}
                  >
                    M{p.month}
                  </span>
                </div>
                <div
                  className={`text-[11px] leading-tight ${isActive ? "text-brand-600" : "text-gray-400"}`}
                >
                  {MONTH_LABELS[p.month - 1] || `Month ${p.month}`}
                </div>
                {pct > 0 && (
                  <div className="mt-2">
                    <ProgressBar
                      value={pct}
                      height="h-1"
                      color={isActive ? "bg-brand-500" : "bg-gray-300"}
                    />
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      {pct}%
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan detail */}
      {plan ? (
        <>
          {/* Header */}
          <div className="card p-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Month {plan.month}: {plan.title}
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                {plan.subtitle}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-2xl font-bold text-brand-600">
                {calcPct(plan)}%
              </span>
              <span className="text-xs text-gray-400">complete</span>
            </div>
          </div>

          {/* Topic sections grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {SECTIONS.map(({ key, label, icon: Icon, color, bg, border }) => {
              const items = plan[key] || [];
              const done = items.filter((i) => i.completed).length;
              return (
                <div
                  key={key}
                  className={`card p-4 border ${border} dark:border-opacity-30`}
                >
                  <div
                    className={`flex items-center gap-2 mb-3 pb-3 border-b ${border} dark:border-opacity-20`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg ${bg} dark:bg-opacity-20 flex items-center justify-center`}
                    >
                      <Icon size={14} className={color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {label}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {done}/{items.length} done
                      </p>
                    </div>
                    {done === items.length && items.length > 0 && (
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 flex-shrink-0"
                      />
                    )}
                  </div>
                  {items.length > 0 ? (
                    <TopicChecklist
                      items={items}
                      onToggle={(i, completed) =>
                        handleToggle(key, i, completed)
                      }
                    />
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No items for this section
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No plan found for this month"
          sub="Run the seed script to generate monthly plans"
        />
      )}
    </div>
  );
}
