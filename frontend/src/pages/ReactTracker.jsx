import { Code2 } from "lucide-react";
import TopicTracker from "./TopicTracker";

const CATEGORIES = ["Core", "Performance", "State", "Advanced", "Patterns", "Testing"];

const CAT_COLORS = {
  Core:        { bg: "bg-cyan-50 dark:bg-cyan-900/25",    text: "text-cyan-700 dark:text-cyan-400",    border: "border-cyan-200 dark:border-cyan-800",    dot: "bg-cyan-400",    badge: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800" },
  Performance: { bg: "bg-blue-50 dark:bg-blue-900/25",    text: "text-blue-700 dark:text-blue-400",    border: "border-blue-200 dark:border-blue-800",    dot: "bg-blue-400",    badge: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  State:       { bg: "bg-violet-50 dark:bg-violet-900/25", text: "text-violet-700 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800", dot: "bg-violet-400", badge: "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800" },
  Advanced:    { bg: "bg-purple-50 dark:bg-purple-900/25", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", dot: "bg-purple-400", badge: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  Patterns:    { bg: "bg-indigo-50 dark:bg-indigo-900/25", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800", dot: "bg-indigo-400", badge: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" },
  Testing:     { bg: "bg-teal-50 dark:bg-teal-900/25",    text: "text-teal-700 dark:text-teal-400",    border: "border-teal-200 dark:border-teal-800",    dot: "bg-teal-400",    badge: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800" },
};

export default function ReactTracker() {
  return (
    <TopicTracker
      tracker="react"
      title="React Tracker"
      icon={Code2}
      categories={CATEGORIES}
      catColors={CAT_COLORS}
      accentClass="bg-cyan-600 border-cyan-600"
    />
  );
}
