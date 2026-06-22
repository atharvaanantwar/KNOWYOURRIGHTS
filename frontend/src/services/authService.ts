import { api } from './api';

const SESSION_KEY = 'knowyourrights_session';
const USER_ID_KEY = 'knowyourrights_user_id';

export const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(localStorage.getItem(USER_ID_KEY));

const saveSession = (name: string, email: string, user_id: string) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));
  localStorage.setItem(USER_ID_KEY, user_id);
};

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await api.signup({
    email,
    password,
    username: name   // 🔥 IMPORTANT FIX
  });

  saveSession(name, email, res.user_id);
  return { name, email };
};

export const loginUser = async (email: string, password: string) => {
  const res = await api.login({ email, password });

  // backend returns user_id + username
  saveSession(res.username, email, res.user_id);

  return {
    name: res.username,
    email
  };
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_ID_KEY);
};