import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err.response?.data || err);
  },
);

export const dashboardApi = {
  get: () => api.get("/dashboard"),
};

export const dsaApi = {
  getAll: (params) => api.get("/dsa", { params }),
  getGrouped: () => api.get("/dsa/grouped"),
  updateStatus: (id, status) => api.patch(`/dsa/${id}/status`, { status }),
  updateNotes: (id, notes) => api.patch(`/dsa/${id}/notes`, { notes }),
  create: (data) => api.post("/dsa", data),
  delete: (id) => api.delete(`/dsa/${id}`),
};

export const systemDesignApi = {
  getAll: () => api.get("/system-design"),
  updateStatus: (id, status) =>
    api.patch(`/system-design/${id}/status`, { status }),
  updateNotes: (id, notes) =>
    api.patch(`/system-design/${id}/notes`, { notes }),
};

export const aiApi = {
  getAll: (params) => api.get("/ai-topics", { params }),
  updateStatus: (id, status) =>
    api.patch(`/ai-topics/${id}/status`, { status }),
  updateNotes: (id, notes) => api.patch(`/ai-topics/${id}/notes`, { notes }),
};

export const monthlyPlanApi = {
  getAll: () => api.get("/monthly-plan"),
  getMonth: (m) => api.get(`/monthly-plan/${m}`),
  toggleTopic: (month, section, index, completed) =>
    api.patch(`/monthly-plan/${month}/topic`, { section, index, completed }),
};

export const dailyTasksApi = {
  getAll: () => api.get("/daily-tasks"),
  getDay: (day) => api.get(`/daily-tasks/${day}`),
  update: (day, data) => api.patch(`/daily-tasks/${day}`, data),
};

export const progressApi = {
  get: () => api.get("/progress"),
  update: (data) => api.patch("/progress", data),
};

export const notesApi = {
  getAll: (params) => api.get("/notes", { params }),
  get: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post("/notes", data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

export const codeApi = {
  run: (data) => api.post("/code/run", data),
  save: (data) => api.post("/code/save", data),
  getSubmissions: (params) => api.get("/code/submissions", { params }),
};

export const topicsApi = {
  getAll: (tracker) => api.get("/topics", { params: { tracker } }),
  updateStatus: (id, status) => api.patch(`/topics/${id}/status`, { status }),
  updateNotes: (id, notes) => api.patch(`/topics/${id}/notes`, { notes }),
};

export const skillsApi = {
  getAll: () => api.get("/skills"),
  getSummary: () => api.get("/skills/summary"),
  updateProgress: (skillId, status) =>
    api.patch(`/skills/${skillId}/progress`, { status }),
  seed: () => api.post("/skills/seed"),
};

export default api;
