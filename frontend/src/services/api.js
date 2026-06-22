// API service aligned with YOUR backend

const API_BASE_URL = "http://localhost:8000";
const token = localStorage.getItem("knowyourrights_token");


// 🔥 get user_id instead of token
const getUserId = () => {
  return localStorage.getItem("knowyourrights_user_id");
};

export const api = {
  // =========================
  // AUTH
  // =========================
  async signup(payload) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Signup failed");
    }

    return response.json();
  },

  async login(payload) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Login failed");
    }

    return response.json();
  },

  // =========================
  // QUESTIONS
  // =========================
  async getQuestions(domain = "", difficulty = 1, limit = 5) {
    const user_id = getUserId();

    const params = new URLSearchParams();
    params.append("user_id", user_id);
    params.append("domain", domain);
    params.append("difficulty", difficulty);
    params.append("limit", limit);

    const response = await fetch(`${API_BASE_URL}/questions?${params}`);

    return response.json();
  },

  async submitAnswer(question_id, selected_answer) {
    const user_id = getUserId();

    const response = await fetch(
      `${API_BASE_URL}/questions/${question_id}/answer?user_id=${user_id}`,
      {
        method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
        body: JSON.stringify({ selected_answer }),
      }
    );

    return response.json();
  },

  async updateUserStats(stats) {
    const user_id = localStorage.getItem("knowyourrights_user_id");

    const response = await fetch(
      `${API_BASE_URL}/api/user/stats?user_id=${user_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      }
    );

    return response.json();
  },

  async addCompletedScenario(data) {
    const user_id = localStorage.getItem("knowyourrights_user_id");

    const response = await fetch(
      `${API_BASE_URL}/api/user/completed-scenarios?user_id=${user_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  },

  async addXPEntry(data) {
    const user_id = localStorage.getItem("knowyourrights_user_id");

    const response = await fetch(
      `${API_BASE_URL}/api/user/xp-history?user_id=${user_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  },

  // =========================
  // PROGRESS
  // =========================
  async getUserProgress() {
    const user_id = getUserId();

    const response = await fetch(
      `${API_BASE_URL}/progress?user_id=${user_id}`
    );

    return response.json();
  },

  // =========================
  // CLEANUP
  // =========================
  logout() {
    localStorage.removeItem("knowyourrights_user_id");
    localStorage.removeItem("knowyourrights_session");
  },
};