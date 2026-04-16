// API service for user data persistence
const API_BASE_URL = 'http://localhost:8000'; // FastAPI backend

export const api = {
  // User stats
  async getUserStats() {
    const response = await fetch(`${API_BASE_URL}/api/user/stats`);
    return response.json();
  },

  async updateUserStats(stats) {
    const response = await fetch(`${API_BASE_URL}/api/user/stats`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    });
    return response.json();
  },

  // Completed scenarios
  async addCompletedScenario(scenario) {
    const response = await fetch(`${API_BASE_URL}/api/user/completed-scenarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenario)
    });
    return response.json();
  },

  async getCompletedScenarios() {
    const response = await fetch(`${API_BASE_URL}/api/user/completed-scenarios`);
    return response.json();
  },

  // XP History
  async addXPEntry(entry) {
    const response = await fetch(`${API_BASE_URL}/api/user/xp-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    return response.json();
  },

  async getXPHistory() {
    const response = await fetch(`${API_BASE_URL}/api/user/xp-history`);
    return response.json();
  },

  // Full progress
  async getUserProgress() {
    const response = await fetch(`${API_BASE_URL}/api/user/progress`);
    return response.json();
  },

  // Questions
  async getQuestions(domain = '', difficulty = '') {
    const params = new URLSearchParams();
    if (domain) params.append('domain', domain);
    if (difficulty) params.append('difficulty', difficulty);

    const response = await fetch(`${API_BASE_URL}/questions?${params}`);
    return response.json();
  }
};