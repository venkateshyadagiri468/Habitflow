const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('habitflow_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Auth endpoints
  register: async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return handleResponse(res);
  },

  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  getProfile: async () => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Habits endpoints
  getHabits: async () => {
    const res = await fetch(`${API_URL}/habits`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createHabit: async (habitData) => {
    const res = await fetch(`${API_URL}/habits`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(habitData)
    });
    return handleResponse(res);
  },

  updateHabit: async (id, habitData) => {
    const res = await fetch(`${API_URL}/habits/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(habitData)
    });
    return handleResponse(res);
  },

  deleteHabit: async (id) => {
    const res = await fetch(`${API_URL}/habits/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Habit logs
  checkIn: async (habitId, date) => {
    const res = await fetch(`${API_URL}/logs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ habitId, date })
    });
    return handleResponse(res);
  },

  undoCheckIn: async (logId) => {
    const res = await fetch(`${API_URL}/logs/${logId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Dashboard endpoint
  getDashboard: async (date) => {
    const queryParam = date ? `?date=${date}` : '';
    const res = await fetch(`${API_URL}/dashboard${queryParam}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Statistics endpoint
  getStatistics: async (date) => {
    const queryParam = date ? `?date=${date}` : '';
    const res = await fetch(`${API_URL}/statistics${queryParam}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Profile management
  updateProfile: async (profileData) => {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  changePassword: async (passwordData) => {
    const res = await fetch(`${API_URL}/profile/password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(passwordData)
    });
    return handleResponse(res);
  },

  deleteAccount: async () => {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
