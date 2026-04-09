import { useState, useCallback } from "react";
import CodeEditor, { DEFAULT_SNIPPETS } from "./CodeEditor";
import { codeApi } from "../../utils/api";
import {
  Play,
  Save,
  Terminal,
  AlertCircle,
  CheckCircle2,
  Loader2,
  History,
} from "lucide-react";

const STATUS_COLOR = {
  Accepted: "text-emerald-600 dark:text-emerald-400",
  "Wrong Answer": "text-red-500 dark:text-red-400",
  "Time Limit Exceeded": "text-amber-500 dark:text-amber-400",
  "Runtime Error": "text-red-500 dark:text-red-400",
  "Compilation Error": "text-orange-500 dark:text-orange-400",
};

export default function CodeExecutionPanel({ problemId, problemName }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_SNIPPETS.python);
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("output"); // output | input

  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
    setCode((prev) => {
      // only reset if still using a default snippet
      const isDefault = Object.values(DEFAULT_SNIPPETS).includes(prev);
      return isDefault ? DEFAULT_SNIPPETS[lang] : prev;
    });
  }, []);

  async function runCode() {
    setRunning(true);
    setResult(null);
    setError("");
    try {
      const res = await codeApi.run({ language, code, stdin });
      setResult(res);
      setActiveTab("output");
    } catch (err) {
      setError(err?.error || "Execution failed. Please try again.");
    } finally {
      setRunning(false);
    }
  }

  async function saveSubmission() {
    if (!result) return;
    setSaving(true);
    try {
      await codeApi.save({
        problemId: problemId || null,
        language,
        code,
        stdin,
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        executionTime: result.time ? Math.round(result.time * 1000) : null,
        memoryUsed: result.memory || null,
        statusDescription: result.status || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const outputText = result
    ? result.stdout || result.stderr || result.compile_output || "(no output)"
    : "";
  const statusStr = result?.status || "";
  const statusClass =
    STATUS_COLOR[statusStr] || "text-gray-600 dark:text-gray-300";

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      {problemName && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Coding:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {problemName}
          </span>
        </p>
      )}

      {/* Editor */}
      <CodeEditor
        language={language}
        onLanguageChange={handleLanguageChange}
        code={code}
        onCodeChange={setCode}
        height="320px"
      />

      {/* Input / Output tabs */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("input")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === "input"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            <Terminal size={12} /> Custom Input
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === "output"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            <History size={12} /> Output
          </button>
        </div>

        <div className="p-3 bg-white dark:bg-gray-800 min-h-[80px]">
          {activeTab === "input" ? (
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              className="w-full resize-none h-20 text-xs font-mono text-gray-700 dark:text-gray-300 bg-transparent outline-none placeholder-gray-400"
              placeholder="Optional stdin (e.g. test case input)..."
            />
          ) : (
            <div>
              {error && (
                <div className="flex items-start gap-2 text-red-500 dark:text-red-400 text-xs">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              {result && (
                <div>
                  <div
                    className={`flex items-center gap-1.5 text-xs font-semibold mb-2 ${statusClass}`}
                  >
                    <CheckCircle2 size={13} />
                    {statusStr}
                    {result.time && (
                      <span className="text-gray-400 font-normal ml-2">
                        {result.time}s
                      </span>
                    )}
                    {result.memory && (
                      <span className="text-gray-400 font-normal">
                        · {result.memory} KB
                      </span>
                    )}
                  </div>
                  <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
                    {outputText}
                  </pre>
                </div>
              )}
              {!result && !error && !running && (
                <p className="text-xs text-gray-400 italic">
                  Run your code to see output here.
                </p>
              )}
              {running && (
                <div className="flex items-center gap-2 text-xs text-indigo-500">
                  <Loader2 size={13} className="animate-spin" />
                  Executing…
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        {result && (
          <button
            onClick={saveSubmission}
            disabled={saving}
            className="btn-ghost text-xs py-1.5"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            Save submission
          </button>
        )}
        <button
          onClick={runCode}
          disabled={running}
          className="btn-primary text-xs py-1.5 px-4"
        >
          {running ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Play size={14} />
          )}
          {running ? "Running…" : "Run Code"}
        </button>
      </div>
    </div>
  );
}
