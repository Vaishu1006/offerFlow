// hooks/useAuth.js
import { useSyncExternalStore, useCallback } from "react";
import { authService } from "../services/authService";
import { storageService } from "../services/storageService";

// ---- module-level store (single source of truth, outside React) ----
let authState = {
  user: storageService.getUser(),
  isAuthenticated: authService.isAuthenticated(),
};

const listeners = new Set();

function setAuthState(next) {
  authState = { ...authState, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return authState;
}

// ---- hook ----
export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    if (data.success) {
      setAuthState({ user: data.user, isAuthenticated: true });
    }
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    if (data.success) {
      setAuthState({ user: data.user, isAuthenticated: true });
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthState({ user: null, isAuthenticated: false });
  }, []);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    role: state.user?.role ?? null, // student | mentor | admin
    login,
    register,
    logout,
  };
}

// Called by axiosInstance's 401 interceptor to force-clear state
// from outside React (no hook context available there)
export function forceLogout() {
  storageService.clearAuth();
  setAuthState({ user: null, isAuthenticated: false });
}