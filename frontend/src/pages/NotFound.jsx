import { useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <MapPin size={28} className="text-gray-400" />
        </div>
        <h1 className="text-5xl font-bold text-gray-600 dark:text-gray-400 mb-2">
          404
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Page not found
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
