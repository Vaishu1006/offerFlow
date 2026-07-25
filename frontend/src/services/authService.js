// services/authService.js
import axiosInstance from "../api/axiosInstance";
import { storageService } from "./storageService";

export const authService = {
  async login(credentials) {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    // expects { success, token, user }
    if (data.success) {
      storageService.setToken(data.token);
      storageService.setUser(data.user);
    }
    return data;
  },

  async register(payload) {
    const { data } = await axiosInstance.post("/auth/register", payload);
    if (data.success) {
      storageService.setToken(data.token);
      storageService.setUser(data.user);
    }
    return data;
  },

  logout() {
    storageService.clearAuth();
  },

  getCurrentUser() {
    return storageService.getUser();
  },

  isAuthenticated() {
    return !!storageService.getToken();
  },
};