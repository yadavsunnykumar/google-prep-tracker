import { Cloud } from "lucide-react";
import TopicTracker from "./TopicTracker";

const CATEGORIES = ["GCP", "AWS", "Networking", "Serverless", "Architecture"];

const CAT_COLORS = {
  GCP:          { bg: "bg-sky-50 dark:bg-sky-900/25",     text: "text-sky-700 dark:text-sky-400",     border: "border-sky-200 dark:border-sky-800",     dot: "bg-sky-400",     badge: "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800" },
  AWS:          { bg: "bg-yellow-50 dark:bg-yellow-900/25", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800", dot: "bg-yellow-400", badge: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" },
  Networking:   { bg: "bg-blue-50 dark:bg-blue-900/25",   text: "text-blue-700 dark:text-blue-400",   border: "border-blue-200 dark:border-blue-800",   dot: "bg-blue-400",   badge: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  Serverless:   { bg: "bg-purple-50 dark:bg-purple-900/25", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", dot: "bg-purple-400", badge: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  Architecture: { bg: "bg-indigo-50 dark:bg-indigo-900/25", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800", dot: "bg-indigo-400", badge: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" },
};

export default function CloudTracker() {
  return (
    <TopicTracker
      tracker="cloud"
      title="Cloud Tracker"
      icon={Cloud}
      categories={CATEGORIES}
      catColors={CAT_COLORS}
      accentClass="bg-sky-600 border-sky-600"
    />
  );
}
