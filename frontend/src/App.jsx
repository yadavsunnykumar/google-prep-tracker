import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/layout/Layout";
import { Spinner } from "./components/ui";

// Eagerly loaded (critical path — always needed)
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

// Lazy loaded — only fetched when navigated to
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MonthlyPlan = lazy(() => import("./pages/MonthlyPlan"));
const DailyTasks = lazy(() => import("./pages/DailyTasks"));
const DSATracker = lazy(() => import("./pages/DSATracker"));
const SystemDesign = lazy(() => import("./pages/SystemDesign"));
const AITracker = lazy(() => import("./pages/AITracker"));
const Notes = lazy(() => import("./pages/Notes"));
const SkillsDashboard = lazy(() => import("./pages/SkillsDashboard"));

function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner size={28} />
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size={32} />
      </div>
    );
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user, logout, updateUser } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout user={user} onLogout={logout} onUpdateUser={updateUser} />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="monthly-plan" element={<MonthlyPlan />} />
          <Route path="daily-tasks" element={<DailyTasks />} />
          <Route path="dsa" element={<DSATracker />} />
          <Route path="system-design" element={<SystemDesign />} />
          <Route path="ai-ml" element={<AITracker />} />
          <Route path="notes" element={<Notes />} />
          <Route path="skills" element={<SkillsDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
