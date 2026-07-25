// services/storageService.js
const TOKEN_KEY = "offerflow_token";
const USER_KEY = "offerflow_user";

export const storageService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser() {
    localStorage.removeItem(USER_KEY);
  },

  clearAuth() {
    this.removeToken();
    this.removeUser();
  },
};