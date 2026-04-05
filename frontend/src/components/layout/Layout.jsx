import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Calendar,
  ListChecks,
  Code2,
  Server,
  Brain,
  Menu,
  X,
  Target,
  Flame,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  User,
  Mail,
  Clock,
  Shield,
  Pencil,
  Check,
  Loader2,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/monthly-plan", icon: Calendar, label: "Monthly Plan" },
  { to: "/daily-tasks", icon: ListChecks, label: "Daily Tasks" },
  { to: "/dsa", icon: Code2, label: "DSA Tracker" },
  { to: "/system-design", icon: Server, label: "System Design" },
  { to: "/ai-ml", icon: Brain, label: "AI / ML" },
];

export default function Layout({ user, onLogout, onUpdateUser }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameVal, setUsernameVal] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const profileRef = useRef(null);
  const { dark, toggle } = useTheme();
  const location = useLocation();

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  // Close profile dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
    setEditingUsername(false);
    setUsernameError("");
  }, [location.pathname]);

  async function handleUsernameSave() {
    const cleaned = usernameVal.trim().toLowerCase();
    if (!cleaned || cleaned === user?.username) {
      setEditingUsername(false);
      return;
    }
    setUsernameSaving(true);
    setUsernameError("");
    try {
      await onUpdateUser({ username: cleaned });
      setEditingUsername(false);
    } catch (err) {
      setUsernameError(err?.error || "Failed to update username");
    } finally {
      setUsernameSaving(false);
    }
  }

  const currentPage =
    NAV.find((n) => location.pathname.startsWith(n.to))?.label || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
            <Target size={18} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              Google Prep
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Interview Tracker
            </div>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="label px-3 mb-2">Navigation</div>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={17} />
              <span>{label}</span>
              <ChevronRight
                size={14}
                className="ml-auto opacity-0 group-hover:opacity-100"
              />
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        {user && (
          <div className="mx-3 mb-2 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
              <User size={13} className="text-brand-700 dark:text-brand-400" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate flex-1">
              {user.username}
            </span>
            <button
              onClick={onLogout}
              title="Logout"
              className="text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}

        {/* Bottom streak card */}
        <div className="mx-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/30 dark:to-brand-800/20 border border-brand-200 dark:border-brand-800">
          <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
            <Flame size={16} />
            <span className="text-sm font-medium">Keep your streak!</span>
          </div>
          <p className="text-xs text-brand-500 dark:text-brand-500 mt-1">
            Complete today's tasks to maintain your progress.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {currentPage}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            {/* Avatar / Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-700 dark:text-brand-400 text-xs font-bold hover:ring-2 hover:ring-brand-300 dark:hover:ring-brand-600 transition-all cursor-pointer"
                aria-label="Open profile menu"
                title="Profile"
              >
                {user?.username?.[0]?.toUpperCase() || "G"}
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-11 w-72 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden animate-in fade-in">
                  {/* Profile header */}
                  <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/30 dark:to-brand-800/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-md">
                        {user?.username?.[0]?.toUpperCase() || "G"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {user?.username || "Guest"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || "No email set"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-5 py-3 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-sm">
                      <User size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Username
                      </span>
                      {editingUsername ? (
                        <div className="ml-auto flex items-center gap-1.5">
                          <input
                            className="w-24 text-xs px-1.5 py-0.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-400"
                            value={usernameVal}
                            onChange={(e) => setUsernameVal(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUsernameSave();
                              if (e.key === "Escape") setEditingUsername(false);
                            }}
                            autoFocus
                            disabled={usernameSaving}
                          />
                          <button
                            onClick={handleUsernameSave}
                            disabled={usernameSaving}
                            className="p-0.5 rounded text-emerald-500 hover:text-emerald-600 transition-colors"
                            title="Save"
                          >
                            {usernameSaving ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Check size={13} />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingUsername(false);
                              setUsernameError("");
                            }}
                            className="p-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Cancel"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="ml-auto flex items-center gap-1.5">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                            {user?.username}
                          </span>
                          <button
                            onClick={() => {
                              setUsernameVal(user?.username || "");
                              setEditingUsername(true);
                              setUsernameError("");
                            }}
                            className="p-0.5 rounded text-gray-400 hover:text-brand-500 transition-colors"
                            title="Edit username"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    {usernameError && (
                      <p className="text-[11px] text-rose-500 dark:text-rose-400 ml-6">
                        {usernameError}
                      </p>
                    )}
                    <div className="flex items-center gap-2.5 text-sm">
                      <Mail size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Email
                      </span>
                      <span className="ml-auto text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                        {user?.email || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                      <Clock
                        size={14}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Joined
                      </span>
                      <span className="ml-auto text-xs font-medium text-gray-700 dark:text-gray-300">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                      <Shield
                        size={14}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Account
                      </span>
                      <span className="ml-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2">
                    <button
                      onClick={toggle}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {dark ? <Sun size={15} /> : <Moon size={15} />}
                      <span>{dark ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
