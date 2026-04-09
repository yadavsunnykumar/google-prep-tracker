import MonacoEditor from "@monaco-editor/react";
import { useTheme } from "../../contexts/ThemeContext";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const MONACO_LANG_MAP = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
};

const DEFAULT_SNIPPETS = {
  javascript: `// JavaScript solution\nfunction solution() {\n  // your code here\n}\n\nconsole.log(solution());`,
  python: `# Python solution\ndef solution():\n    # your code here\n    pass\n\nprint(solution())`,
  java: `// Java solution\npublic class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}`,
  cpp: `// C++ solution\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}`,
};

export { LANGUAGE_OPTIONS, DEFAULT_SNIPPETS };

export default function CodeEditor({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  height = "320px",
}) {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Language selector bar */}
      <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Language:
        </span>
        <div className="flex gap-1.5">
          {LANGUAGE_OPTIONS.map((l) => (
            <button
              key={l.value}
              onClick={() => onLanguageChange(l.value)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                language === l.value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Monaco editor */}
      <MonacoEditor
        height={height}
        language={MONACO_LANG_MAP[language]}
        value={code}
        onChange={(val) => onCodeChange(val || "")}
        theme={isDark ? "vs-dark" : "light"}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          renderLineHighlight: "line",
          tabSize: 2,
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  );
}
