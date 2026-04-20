import { Box } from "lucide-react";
import TopicTracker from "./TopicTracker";

const CATEGORIES = ["Containers", "Orchestration", "CI/CD", "IaC", "Observability", "SRE"];

const CAT_COLORS = {
  Containers:    { bg: "bg-orange-50 dark:bg-orange-900/25",  text: "text-orange-700 dark:text-orange-400",  border: "border-orange-200 dark:border-orange-800",  dot: "bg-orange-400",  badge: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800" },
  Orchestration: { bg: "bg-amber-50 dark:bg-amber-900/25",   text: "text-amber-700 dark:text-amber-400",   border: "border-amber-200 dark:border-amber-800",   dot: "bg-amber-400",   badge: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  "CI/CD":       { bg: "bg-yellow-50 dark:bg-yellow-900/25", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800", dot: "bg-yellow-400", badge: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" },
  IaC:           { bg: "bg-lime-50 dark:bg-lime-900/25",     text: "text-lime-700 dark:text-lime-400",     border: "border-lime-200 dark:border-lime-800",     dot: "bg-lime-400",     badge: "bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-800" },
  Observability: { bg: "bg-green-50 dark:bg-green-900/25",   text: "text-green-700 dark:text-green-400",   border: "border-green-200 dark:border-green-800",   dot: "bg-green-400",   badge: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" },
  SRE:           { bg: "bg-red-50 dark:bg-red-900/25",       text: "text-red-700 dark:text-red-400",       border: "border-red-200 dark:border-red-800",       dot: "bg-red-400",       badge: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800" },
};

export default function DevOpsTracker() {
  return (
    <TopicTracker
      tracker="devops"
      title="DevOps Tracker"
      icon={Box}
      categories={CATEGORIES}
      catColors={CAT_COLORS}
      accentClass="bg-orange-600 border-orange-600"
    />
  );
}
